import React,{useEffect,useRef,useState,useReducer} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,Save,Plus,Copy,RefreshCw,ShieldCheck,ChevronRight,Undo2,Redo2} from 'lucide-react';
import {blank,C,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID,type Draft,type Field} from './schema.ts';
import {isEditable,duplicateDraft,createMondayAdapter,type Quote,type Ref} from './adapter.ts';
import {createMockAdapter} from './mock.ts';
import {calculate,applyCosting,type Costing} from './costing.ts';
import {specificationDescription,supplierDescription,companyContact} from './customer.ts';
import {TextField,SelectField,TextArea,ReadField,Panel} from './components/Fields.tsx';
import {CustomerPreview} from './components/CustomerPreview.tsx';
import {historyReducer,startHistory,type HistoryAction} from './history.ts';
import './style.css';
const isLive=import.meta.env.VITE_APP_MODE==='monday';
const writesEnabled=isLive&&import.meta.env.VITE_MONDAY_WRITES_ENABLED==='true';
const mock=createMockAdapter();
const money=(n:string)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:4}).format(Number(n));
function App() {
 const[quotes,setQuotes]=useState<Quote[]>([]),[current,setCurrent]=useState(''),[saved,setSaved]=useState<Draft>(()=>({...blank(),status:'Draft'}));
 const[history,dispatch]=useReducer(historyReducer,{...blank(),status:'Draft'},startHistory);
 const draft=history.present;
 const setDraft=(value:Extract<HistoryAction,{type:'edit'}>['value'])=>dispatch({type:'edit',value});
 const resetDraft=(value:Draft)=>dispatch({type:'reset',value});
 const[lookups,setLookups]=useState<Record<string,string[]>>({}),[refs,setRefs]=useState<Record<string,Ref[]>>({}),[query,setQuery]=useState(''),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[ready,setReady]=useState(false),[preview,setPreview]=useState(false);
 const adapter=useRef<ReturnType<typeof createMondayAdapter>>(mock), generation=useRef(0);
 const dirty=JSON.stringify(draft)!==JSON.stringify(saved), locked=!!current&&!isEditable(quotes.find(q=>q.id===current)?.values.status??'');
 const busy=loading||saving;
 const set=(key:Field,value:string)=>{setDraft(d=>key==='company'?{...d,company:value,contact:companyContact(value,refs.company??[],refs.contact??[])}:{...d,[key]:value});setNotice('')};
 const copyDescription=async(field:'customerDesc'|'supplierDesc')=>{
  try{await navigator.clipboard.writeText(draft[field]);setNotice(`${field==='customerDesc'?'Customer':'Supplier'} description copied`)}
  catch{setError('Clipboard access is unavailable. Select and copy the description text directly.')}
 };
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
 const select=(q:Quote)=>{if(busy||!discard())return;setCurrent(q.id);resetDraft({...q.values});setSaved({...q.values});setNotice('');setPreview(false)};
 const newDraft=()=>{if(busy||!discard())return;const d={...blank(),status:'Draft',visibility:'Private'};setCurrent('');resetDraft(d);setSaved(d);setPreview(false);setNotice('New draft')};
 const duplicate=()=>{if(busy)return;const d=duplicateDraft(draft);setCurrent('');resetDraft(d);setSaved({...blank(),status:'Draft',visibility:'Private'});setNotice('Copy ready — save to create a separate draft');setPreview(false)};
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
   setCurrent(writtenId);resetDraft({...draft});setSaved({...draft});
   const q=await a.loadQuotes();setQuotes(q);const row=q.find(q=>q.id===writtenId);
   if(!row)throw new Error('Saved quotation was not found on readback. Refresh records before further editing.');
   resetDraft({...row.values});setSaved({...row.values});setNotice(isLive?'Draft saved in Monday':'Demo draft saved for this preview session');
  } catch(e) {if(writtenId)setReady(false);setError(`${writtenId?'Save completed, but readback failed. Refresh before retrying. ':''}${e instanceof Error?e.message:String(e)}`)}finally{setSaving(false)}
 };
 const supplierMatches=(refs.company??[]).filter(c=>c.name===draft.supplierDropdown);
 const supplierId=supplierMatches.length===1?supplierMatches[0].id:'';
 const supplierContacts=(refs.supplierContact??[]).filter(c=>!!supplierId&&c.companyIds?.includes(supplierId));
 const customerContacts=(refs.contact??[]).filter(c=>!!draft.company&&c.companyIds?.includes(draft.company));
 const company=(refs.company??[]).find(c=>c.id===draft.company),contact=customerContacts.find(c=>c.id===draft.contact);
 let costing:Costing|undefined,calculationError='';try{costing=calculate(draft)}catch(e){calculationError=e instanceof Error?e.message:String(e)}
 const editor={draft,set,disabled:locked||busy};
 const text=(field:Field,label:string,type:'text'|'number'='text')=><TextField key={field} {...editor} field={field} label={label} type={type}/>;
 const choice=(field:Field,label:string,options:Ref[])=><SelectField key={field} {...editor} field={field} label={label} options={options}/>;
 const dropdown=(field:Field,label:string)=>choice(field,label,(lookups[C[field]]??[]).map(v=>({id:v,name:v})));
 const filtered=quotes.filter(q=>`${q.name} ${q.values.status} ${q.values.packaging} ${(refs.company??[]).find(c=>c.id===q.values.company)?.name??''}`.toLowerCase().includes(query.toLowerCase()));
 return <main>
  <div className="banner"><div className="brand-mark">ZP</div><b>ZERO PACK <span>Quote Manager</span></b><div className="mode"><ShieldCheck size={14}/>{isLive?(writesEnabled?'Monday · Staff draft editor':'Monday · Read only'):'Demo preview · Synthetic data'}</div></div>
  <div className="workspace"><aside className="sidebar"><div className="sidebar-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Quotations</h2></div><button className="small outline" disabled={busy} onClick={newDraft} aria-label="New quotation"><Plus size={18}/></button></div><label className="search"><Search size={16}/><input aria-label="Search quotations" placeholder="Search quotations…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="list-meta">{filtered.length} quotations</div><div className="quote-list">{filtered.map(q=><button disabled={busy} key={q.id} className={'quote '+(q.id===current?'active':'')} onClick={()=>select(q)}><span className="quote-status">{q.values.status}</span><strong>{q.name}</strong><small>{q.values.packaging||'No specifications'}</small></button>)}{!loading&&!filtered.length&&<p className="muted">No quotations found.</p>}</div><button className="reload" disabled={busy} onClick={()=>{if(discard()){setCurrent('');resetDraft({...blank(),status:'Draft'});setSaved({...blank(),status:'Draft'});void reload()}}}><RefreshCw size={14}/> Refresh records</button><div className="sidebar-note">Staff workspace<br/>Private prototype board</div></aside>
  <section className="main"><header className="top"><div><div className="eyebrow">QUOTATIONS <ChevronRight size={12}/> {current?'EDIT QUOTATION':'NEW DRAFT'}</div><h1>{draft.name||'Quote Builder'}</h1></div><div className="actions"><button className="outline small" disabled={busy||locked||!history.past.length} onClick={()=>{dispatch({type:'undo'});setNotice('')}} aria-label="Undo"><Undo2 size={16}/>Undo</button><button className="outline small" disabled={busy||locked||!history.future.length} onClick={()=>{dispatch({type:'redo'});setNotice('')}} aria-label="Redo"><Redo2 size={16}/>Redo</button><button className="outline small" disabled={busy||!dirty} onClick={()=>{resetDraft({...saved});setError('');setNotice('Unsaved changes discarded')}}>Discard</button><button className="outline" disabled={busy} onClick={duplicate}><Copy size={16}/> Duplicate</button><button className="primary" disabled={busy||!ready||locked||(isLive&&!writesEnabled)} onClick={()=>void save()}><Save size={16}/>{saving?'Saving…':isLive?'Save Draft':'Save Demo'}</button></div></header>
   <div className="messages" aria-live="polite">{loading&&<div className="message">Loading {isLive?'Monday records':'demo workspace'}…</div>}{error&&<div className="message error" role="alert">{error}</div>}{notice&&<div className="message success">{notice}</div>}{locked&&<div className="message warning">This quotation is locked. Duplicate it to start a new draft.</div>}{dirty&&<div className="dirty">● Unsaved changes</div>}</div>
   <div className="tabs"><button className={!preview?'selected':''} onClick={()=>setPreview(false)}>Quote workspace</button><button className={preview?'selected':''} onClick={()=>setPreview(true)}>Customer description preview</button></div>
   <div className="content">{preview?<CustomerPreview draft={draft}/>:<>
    <div className="identity-grid">
     <Panel title="Quote details"><div className="stack-fields">{text('name','Quote reference')}{choice('status','Quote status',['Draft','Costing','Review','Ready to Issue','Declined','Expired'].map(v=>({id:v,name:v})))}{choice('deal','Deal',refs.deal??[])}{choice('project','Client project',refs.project??[])}{text('artwork','Artwork design reference')}</div></Panel>
     <Panel title="Customer"><div className="stack-fields">{choice('company','Customer company',refs.company??[])}{choice('contact','Customer contact',customerContacts)}<div className="fields cols2"><ReadField label="First name" value={contact?.firstName??''}/><ReadField label="Last name" value={contact?.lastName??''}/></div><ReadField label="Email" value={contact?.email??''}/><ReadField label="Contact number" value={contact?.phone||company?.companyPhone||''}/></div></Panel>
     <Panel title="Shipping details"><div className="stack-fields"><label className="field"><span>Shipping address</span><textarea aria-label="Shipping address" rows={3} value={company?.shippingAddress??''} readOnly placeholder="No shipping address recorded on this company"/></label>{!company?.shippingAddress&&company?.businessAddress&&<ReadField label="Business address · Shipping not confirmed" value={company.businessAddress}/>}<p className="hint">Current company/contact details from Monday. These are read-only; they are not a saved quote address snapshot.</p></div></Panel>
    </div>
    <Panel title="Packaging specifications & costing" eyebrow="Staff only">
     <div className="quote-form-grid">
      <div className="specification-column"><h3>Packaging</h3><div className="row-fields">{dropdown('supplierDropdown','Supplier')}{choice('supplierContact','Supplier contact',supplierContacts)}{dropdown('colour','Colour')}{dropdown('packaging','Packaging type')}{dropdown('printing','Printing')}{text('size','Size')}{text('microns','Thickness (microns)','number')}{dropdown('style','Style')}{text('quantity','Supplier quantity','number')}{text('usdUnit','Supplier USD / unit','number')}{text('fx','FX · AUD per USD','number')}{text('transaction','Plate / transaction fee AUD','number')}<ReadField label="Supplier AUD / unit" value={costing?.audUnit??''}/>{text('sellQuantity','Sell quantity','number')}{text('markup','Product markup %','number')}</div>{draft.supplierDropdown&&!supplierId&&<p className="hint warning-text">Verify the supplier’s canonical company link before choosing a contact.</p>}<p className="hint">Contacts use existing company links.</p><button className="outline apply-calculation" disabled={!costing||locked||busy} onClick={()=>{setDraft(d=>applyCosting(d,costing!));setNotice('Calculation applied to this draft. Save to retain the snapshot.')}}>Apply calculation</button></div>
      <div className="costing-column"><h3>Shipping & import costs</h3><div className="fields cols2 freight-size">{text('weight','Weight (kg)','number')}{text('cbm','CBM','number')}</div><div className="fields cols2 charges">{text('shipping','Shipping USD','number')}{text('bank','Bank fees USD','number')}<ReadField label="Insurance USD" value={costing?.insuranceUSD??''}/><ReadField label="Insurance AUD" value={costing?.insuranceAUD??''}/>{text('duty','Customs duty AUD','number')}{text('customs','Customs fees AUD','number')}</div><ReadField label="Shipping total AUD" value={costing?money(costing.freightAUD):''}/><details className="insurance-settings"><summary>Insurance calculation</summary>{text('insurance','Insurance USD seed','number')}<p className="hint">VBA: 0.3% of USD product total when shipping is positive, rounded to a whole USD using half-to-even. If below USD 30 and the saved seed is positive, use USD 30. AUD = insurance USD × saved FX.</p></details>
       <h3>Calculated totals</h3><div className="row-fields calculation-totals"><ReadField label="Total USD" value={costing?.totalUSD??'—'}/><ReadField label="Total AUD" value={costing?.totalAUD??'—'}/><ReadField label="Cost per unit AUD" value={costing?.costUnitAUD??'—'}/><ReadField label="Total product cost AUD" value={costing?.productCostAUD??'—'}/><ReadField label="Selling price / unit AUD" value={costing?.productSellUnitAUD??'—'}/><ReadField label="Total product selling AUD" value={costing?.productSellAUD??'—'}/><ReadField label="Product profit AUD" value={costing?.profitAUD??'—'}/><ReadField label="All-in selling / supplier unit AUD" value={costing?.allInUnitAUD??'—'}/><ReadField label="Total landed cost AUD" value={costing?.landedAUD??'—'}/></div>{calculationError&&<p className="hint">{calculationError}</p>}<p className="hint">Selling price is product only. All-in adds shipping/import costs to product selling total, then divides by supplier quantity.</p>
      </div>
      <div className="description-column"><div className="description-heading"><h3>Supplier description</h3><div className="description-buttons"><button className="outline small" disabled={locked||busy} onClick={()=>{if(!draft.supplierDesc||window.confirm('Replace the edited supplier description?'))set('supplierDesc',supplierDescription(draft,company?.name,company?.shippingAddress))}} aria-label="Update supplier description">Update</button><button className="outline small" disabled={!draft.supplierDesc} onClick={()=>void copyDescription('supplierDesc')} aria-label="Copy supplier description">Copy</button></div></div><TextArea {...editor} field="supplierDesc" label="Supplier description · Internal"/><div className="description-heading"><h3>Customer description</h3><div className="description-buttons"><button className="outline small" disabled={locked||busy} onClick={()=>{if(!draft.customerDesc||window.confirm('Replace the edited customer description?'))set('customerDesc',specificationDescription(draft,company?.shippingAddress))}} aria-label="Update customer description">Update</button><button className="outline small" disabled={!draft.customerDesc} onClick={()=>void copyDescription('customerDesc')} aria-label="Copy customer description">Copy</button></div></div><TextArea {...editor} field="customerDesc" label="Customer description"/><p className="hint">Build from specifications, edit as needed, then copy to QBO. Certification wording follows the verified country and thickness rules.</p><TextArea {...editor} field="notes" label="Internal notes"/></div>
     </div>
     <div className="cost-summary" aria-label="Cost summary"><div><span>Product cost AUD</span><b>{costing?money(costing.productCostAUD):'—'}</b></div><div><span>Freight & import costs AUD</span><b>{costing?money(costing.freightAUD):'—'}</b></div><div><span>Total landed AUD</span><b>{costing?money(costing.landedAUD):'—'}</b></div><div><span>Product profit AUD</span><b>{costing?money(costing.profitAUD):'—'}</b><small>Product margin {costing?`${costing.marginPercent}%`:'—'}</small></div></div>
     <details className="saved-values" open><summary>Saved prices & exchange-rate snapshot</summary><div className="fields cols3">{text('audUnit','Saved supplier AUD / unit','number')}{text('landed','Saved total landed AUD','number')}{text('sellUnit','Saved product price AUD / unit','number')}</div><div className="fields cols2 metadata-fields">{text('fxSource','FX source / snapshot date')}{text('pricingVersion','Pricing version')}</div><p className="hint">Calculated prices are applied explicitly. Save to retain the snapshot; saved FX and descriptions are never replaced automatically.</p></details>
    </Panel>
   </>}<footer><span>Zero Pack Quote Manager · v0.3.0</span><span>{isLive?'Private Monday workspace':'Demo changes reset when this page reloads'} · Draft only</span></footer></div>
  </section></div>
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
