import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,Save,Plus,Copy,RefreshCw,ShieldCheck,ChevronRight} from 'lucide-react';
import {blank,C,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID,type Draft,type Field} from './schema.ts';
import {isEditable,duplicateDraft,createMondayAdapter,type Quote,type Ref} from './adapter.ts';
import {createMockAdapter} from './mock.ts';
import {calculate,applyCosting,type Costing} from './costing.ts';
import {specificationDescription} from './customer.ts';
import {TextField,SelectField,TextArea,Panel} from './components/Fields.tsx';
import {CustomerPreview} from './components/CustomerPreview.tsx';
import './style.css';
const isLive=import.meta.env.VITE_APP_MODE==='monday';
const writesEnabled=isLive&&import.meta.env.VITE_MONDAY_WRITES_ENABLED==='true';
const mock=createMockAdapter();
const money=(n:string)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:4}).format(Number(n));
function App() {
 const[quotes,setQuotes]=useState<Quote[]>([]),[current,setCurrent]=useState(''),[draft,setDraft]=useState<Draft>(()=>({...blank(),status:'Draft'})),[saved,setSaved]=useState<Draft>(()=>({...blank(),status:'Draft'}));
 const[lookups,setLookups]=useState<Record<string,string[]>>({}),[refs,setRefs]=useState<Record<string,Ref[]>>({}),[query,setQuery]=useState(''),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[ready,setReady]=useState(false),[preview,setPreview]=useState(false);
 const adapter=useRef<ReturnType<typeof createMondayAdapter>>(mock), generation=useRef(0);
 const dirty=JSON.stringify(draft)!==JSON.stringify(saved), locked=!!current&&!isEditable(quotes.find(q=>q.id===current)?.values.status??'');
 const busy=loading||saving;
 const set=(key:Field,value:string)=>{setDraft(d=>({...d,[key]:value}));setNotice('')};
 const reload=async()=>{
  const run=++generation.current;setLoading(true);setReady(false);setError('');
  try {
   if(isLive) {const live=await import('./monday.ts');await live.confirmContext();adapter.current=live.liveAdapter;}
   const a=adapter.current;
   const[q,columns,companies,contacts,deals,projects]=await Promise.all([a.loadQuotes(),a.fetchColumns(),a.loadRefs(COMPANY_BOARD_ID),a.loadRefs(CONTACT_BOARD_ID),a.loadRefs(DEAL_BOARD_ID),a.loadRefs(PROJECT_BOARD_ID)]);
   if(run!==generation.current)return;
   setQuotes(q);setLookups(columns);setRefs({company:companies,contact:contacts,supplierContact:contacts,deal:deals,project:projects});setReady(true);
  }catch(e){if(run===generation.current)setError(e instanceof Error?e.message:String(e))}finally{if(run===generation.current)setLoading(false)}
 };
 useEffect(()=>{void reload();return()=>{generation.current++}},[]);
 useEffect(()=>{
  const handler=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue=''}};
  window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);
 },[dirty]);
 const discard=()=>!dirty||window.confirm('Discard unsaved changes?');
 const select=(q:Quote)=>{if(busy||!discard())return;setCurrent(q.id);setDraft({...q.values});setSaved({...q.values});setNotice('');setPreview(false)};
 const newDraft=()=>{if(busy||!discard())return;const d={...blank(),status:'Draft',visibility:'Private'};setCurrent('');setDraft(d);setSaved(d);setPreview(false);setNotice('New draft')};
 const duplicate=()=>{if(busy)return;const d=duplicateDraft(draft);setCurrent('');setDraft(d);setSaved(blank());setNotice('Copy ready — save to create a separate draft');setPreview(false)};
 const save=async()=>{
  setSaving(true);setError('');setNotice('');let writtenId='';
  try {
   const a=adapter.current,original=quotes.find(q=>q.id===current);
   // Canonical contact-company links must already exist. Never repair by inference here.
   if(draft.contact&&!(refs.contact??[]).find(r=>r.id===draft.contact)?.companyIds?.includes(draft.company)) throw new Error('Customer contact is not linked to the selected company. Verify the canonical link in Monday.');
   if(draft.supplierContact) {
    const supplier=(refs.company??[]).filter(c=>c.name===draft.supplierDropdown);
    const contact=(refs.supplierContact??[]).find(r=>r.id===draft.supplierContact);
    if(supplier.length!==1||!contact?.companyIds?.includes(supplier[0].id)) throw new Error('Select a supplier contact with a verified link to the supplier company.');
   }
   writtenId=await a.saveQuote(draft,current||undefined,original?.updated_at);
   // Keep the created ID immediately; a failed refresh must never turn retry into another create.
   setCurrent(writtenId);setSaved({...draft});
   const q=await a.loadQuotes();setQuotes(q);const row=q.find(q=>q.id===writtenId);
   if(!row)throw new Error('Saved quotation was not found on readback. Refresh records before further editing.');
   setDraft({...row.values});setSaved({...row.values});setNotice(isLive?'Draft saved in Monday':'Demo draft saved for this preview session');
  } catch(e) {if(writtenId)setReady(false);setError(`${writtenId?'Save completed, but readback failed. Refresh before retrying. ':''}${e instanceof Error?e.message:String(e)}`)}finally{setSaving(false)}
 };
 const supplierMatches=(refs.company??[]).filter(c=>c.name===draft.supplierDropdown);
 const supplierId=supplierMatches.length===1?supplierMatches[0].id:'';
 const supplierContacts=(refs.supplierContact??[]).filter(c=>!!supplierId&&c.companyIds?.includes(supplierId));
 const customerContacts=(refs.contact??[]).filter(c=>!!draft.company&&c.companyIds?.includes(draft.company));
 let costing:Costing|undefined,calculationError='';try{costing=calculate(draft)}catch(e){calculationError=e instanceof Error?e.message:String(e)}
 const editor={draft,set,disabled:locked||busy};
 const text=(field:Field,label:string,type:'text'|'number'='text')=><TextField key={field} {...editor} field={field} label={label} type={type}/>;
 const choice=(field:Field,label:string,options:Ref[])=><SelectField key={field} {...editor} field={field} label={label} options={options}/>;
 const dropdown=(field:Field,label:string)=>choice(field,label,(lookups[C[field]]??[]).map(v=>({id:v,name:v})));
 const filtered=quotes.filter(q=>`${q.name} ${q.values.status} ${q.values.packaging} ${(refs.company??[]).find(c=>c.id===q.values.company)?.name??''}`.toLowerCase().includes(query.toLowerCase()));
 return <main>
  <div className="banner"><div className="brand-mark">ZP</div><b>ZERO PACK <span>Quote Manager</span></b><div className="mode"><ShieldCheck size={14}/>{isLive?(writesEnabled?'Monday · Staff draft editor':'Monday · Read only'):'Demo preview · Synthetic data'}</div></div>
  <div className="workspace"><aside className="sidebar"><div className="sidebar-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Quotations</h2></div><button className="small outline" disabled={busy} onClick={newDraft} aria-label="New quotation"><Plus size={18}/></button></div><label className="search"><Search size={16}/><input aria-label="Search quotations" placeholder="Search quotations…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="list-meta">{filtered.length} quotations</div><div className="quote-list">{filtered.map(q=><button disabled={busy} key={q.id} className={'quote '+(q.id===current?'active':'')} onClick={()=>select(q)}><span className="quote-status">{q.values.status}</span><strong>{q.name}</strong><small>{q.values.packaging||'No specifications'}</small></button>)}{!loading&&!filtered.length&&<p className="muted">No quotations found.</p>}</div><button className="reload" disabled={busy} onClick={()=>{if(discard()){setCurrent('');setDraft({...blank(),status:'Draft'});setSaved({...blank(),status:'Draft'});void reload()}}}><RefreshCw size={14}/> Refresh records</button><div className="sidebar-note">Staff workspace<br/>Private prototype board</div></aside>
  <section className="main"><header className="top"><div><div className="eyebrow">QUOTATIONS <ChevronRight size={12}/> {current?'EDIT QUOTATION':'NEW DRAFT'}</div><h1>{draft.name||'Quote Builder'}</h1><p>One supplier. One design. A clear quotation.</p></div><div className="actions"><button className="outline" disabled={busy} onClick={duplicate}><Copy size={16}/> Duplicate</button><button className="primary" disabled={busy||!ready||locked||(isLive&&!writesEnabled)} onClick={()=>void save()}><Save size={16}/>{saving?'Saving…':isLive?'Save Draft':'Save Demo'}</button></div></header>
   <div className="messages" aria-live="polite">{loading&&<div className="message">Loading {isLive?'Monday records':'demo workspace'}…</div>}{error&&<div className="message error" role="alert">{error}</div>}{notice&&<div className="message success">{notice}</div>}{locked&&<div className="message warning">This quotation is locked. Duplicate it to start a new draft.</div>}{dirty&&<div className="dirty">● Unsaved changes</div>}</div>
   <div className="tabs"><button className={!preview?'selected':''} onClick={()=>setPreview(false)}>Quote workspace</button><button className={preview?'selected':''} onClick={()=>setPreview(true)}>Customer description preview</button></div>
   <div className="content">{preview?<CustomerPreview draft={draft}/>:<>
    <Panel title="Quote details"><div className="fields cols3">{text('name','Quote reference')}{choice('status','Quote status',['Draft','Costing','Review','Ready to Issue','Declined','Expired'].map(v=>({id:v,name:v})))}{text('artwork','Artwork design reference')}</div></Panel>
    <Panel title="Customer & supplier"><div className="fields cols3">{choice('company','Customer company',refs.company??[])}{choice('contact','Customer contact',customerContacts)}{dropdown('supplierDropdown','Supplier')}{choice('supplierContact','Supplier contact',supplierContacts)}{choice('deal','Deal',refs.deal??[])}{choice('project','Client project',refs.project??[])}</div>{draft.supplierDropdown&&!supplierId&&<p className="hint warning-text">Supplier lookup has no unique exact company match. Verify its canonical company link before choosing a contact.</p>}<p className="hint">Contacts are filtered by existing company links. Existing values are retained until you explicitly change them.</p></Panel>
    <Panel title="Packaging specifications"><div className="fields specification-fields">{dropdown('packaging','Packaging type')}{text('size','Size')}{dropdown('style','Style')}{dropdown('colour','Colour')}{dropdown('printing','Printing')}</div><div className="fields numeric-grid">{text('microns','Thickness (microns)','number')}{text('quantity','Supplier quantity','number')}{text('sellQuantity','Sell quantity','number')}{text('weight','Weight (kg)','number')}{text('cbm','CBM','number')}</div></Panel>
    <Panel title="Internal costing" eyebrow="Staff only"><div className="fields numeric-grid">{text('usdUnit','Supplier USD / unit','number')}{text('fx','FX · AUD per USD','number')}{text('shipping','Shipping USD','number')}{text('insurance','Insurance USD seed','number')}{text('transaction','Transaction fee AUD','number')}{text('bank','Bank fees USD','number')}{text('customs','Customs fees AUD','number')}{text('duty','Customs duty AUD','number')}{text('markup','Product markup %','number')}</div><div className="fields cols2 metadata-fields">{text('fxSource','FX source / snapshot date')}{text('pricingVersion','Pricing version')}</div><p className="hint">Legacy insurance uses 0.3% of USD product total, integer rounding and the Access minimum rule. Enter a positive insurance seed to retain the USD 30 minimum. No live rate lookup.</p>
     {costing?<><div className="cost-summary"><div><span>Product cost</span><b>{money(costing.productCostAUD)}</b></div><div><span>Freight & import costs</span><b>{money(costing.freightAUD)}</b></div><div><span>Total landed</span><b>{money(costing.landedAUD)}</b></div><div><span>Product profit</span><b>{money(costing.profitAUD)}</b></div></div><div className="calc-note"><span>Calculated product price / unit <b>{money(costing.productSellUnitAUD)}</b> · All-in reference / supplier unit <b>{money(costing.allInUnitAUD)}</b><br/>Calculated insurance: USD {costing.insuranceUSD} · Product margin: {costing.marginPercent}%</span><button className="outline" disabled={locked||busy} onClick={()=>{setDraft(d=>applyCosting(d,costing!));setNotice('Calculation applied to this draft. Save to retain the snapshot.')}}>Apply calculation</button></div></>:<p className="hint">{calculationError}</p>}
     <div className="fields numeric-grid saved-prices">{text('audUnit','Saved supplier AUD / unit','number')}{text('landed','Saved total landed AUD','number')}{text('sellUnit','Saved product price AUD / unit','number')}</div><p className="hint">Calculation results never overwrite saved prices until Apply calculation is selected. Freight is passed through separately in the Access model.</p>
    </Panel>
    <Panel title="Descriptions & internal notes"><p className="description-preview">{specificationDescription(draft)||'Select specifications to build the description.'}</p><div className="description-actions"><button className="outline small" disabled={locked||busy} onClick={()=>{if(!draft.customerDesc||window.confirm('Replace the edited customer description?'))set('customerDesc',specificationDescription(draft))}}>Use for customer</button><button className="outline small" disabled={locked||busy} onClick={()=>{if(!draft.supplierDesc||window.confirm('Replace the edited supplier description?'))set('supplierDesc',specificationDescription(draft))}}>Use for supplier</button></div><div className="fields cols2"><TextArea {...editor} field="customerDesc" label="Customer description"/><TextArea {...editor} field="supplierDesc" label="Supplier description · Internal"/></div><TextArea {...editor} field="notes" label="Internal notes"/></Panel>
   </>}<footer><span>Zero Pack Quote Manager · v0.3.0</span><span>{isLive?'Private Monday workspace':'Demo changes reset when this page reloads'} · Draft only</span></footer></div>
  </section></div>
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
