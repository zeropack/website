import React,{useEffect,useRef,useState,useReducer} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,Save,Plus,Copy,RefreshCw,ShieldCheck,ChevronRight,Undo2,Redo2} from 'lucide-react';
import {blank,C,COMPANY_BOARD_ID,CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID,type Draft,type Field} from './schema.ts';
import {isEditable,duplicateDraft,createMondayAdapter,validateDraft,type Quote,type Ref} from './adapter.ts';
import {createMockAdapter} from './mock.ts';
import {calculate,applyCosting,PRICING_VERSION,type Costing} from './costing.ts';
import {companyContact,updateDescriptions,generatedDescriptions,shippingQuote} from './customer.ts';
import {TextField,SelectField,TextArea,ReadField,Panel} from './components/Fields.tsx';
import {CustomerPreview} from './components/CustomerPreview.tsx';
import {historyReducer,startHistory,type HistoryAction} from './history.ts';
import {fetchExchangeRate,newQuote,rateColour,type ExchangeRate} from './exchange-rate.ts';
import {supplierCompany,supplierOptions} from './suppliers.ts';
import {autosavePreference,rememberAutosave} from './autosave.ts';
import brandLogo from './assets/zero-pack-registered-white.png';
import './style.css';
const isLive=import.meta.env.VITE_APP_MODE==='monday';
const writesEnabled=isLive&&import.meta.env.VITE_MONDAY_WRITES_ENABLED==='true';
const mock=createMockAdapter();
const money=(n:string)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:4}).format(Number(n));
function App() {
 const[quotes,setQuotes]=useState<Quote[]>([]),[current,setCurrent]=useState(''),[saved,setSaved]=useState<Draft>(()=>newQuote());
 const[history,dispatch]=useReducer(historyReducer,newQuote(),startHistory);
 const [rate,setRate]=useState<ExchangeRate>(),[rateError,setRateError]=useState(''),[rateLoading,setRateLoading]=useState(true);
 const defaultFxEligible=useRef(true),saveInProgress=useRef(false);
 const[autosave,setAutosave]=useState(autosavePreference),[autosavePaused,setAutosavePaused]=useState(false),[refreshingRefs,setRefreshingRefs]=useState(false);
 const lastReferenceRefresh=useRef(0),referenceRefreshRunning=useRef(false);
 const draft=history.present;
 const setDraft=(value:Extract<HistoryAction,{type:'edit'}>['value'])=>dispatch({type:'edit',value});
 const resetDraft=(value:Draft)=>dispatch({type:'reset',value});
 const[lookups,setLookups]=useState<Record<string,string[]>>({}),[refs,setRefs]=useState<Record<string,Ref[]>>({}),[query,setQuery]=useState(''),[companyFilter,setCompanyFilter]=useState(''),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[ready,setReady]=useState(false),[preview,setPreview]=useState(false);
 const adapter=useRef<ReturnType<typeof createMondayAdapter>>(mock), generation=useRef(0);
 const dirty=JSON.stringify(draft)!==JSON.stringify(saved), locked=!!current&&!isEditable(quotes.find(q=>q.id===current)?.values.status??'');
 const busy=loading||saving;
 const set=(key:Field,value:string)=>{
  if(key==='fx')defaultFxEligible.current=false;
   setDraft(d=>{
   const next=key==='company'?{...d,company:value,contact:companyContact(value,refs.company??[],refs.contact??[])}:{...d,[key]:value,...(key==='fx'?{fxSource:'Manual quote rate'}:{})};
   return updateDescriptions(d,next,(refs.company??[]).find(c=>c.id===next.company));
  });setNotice('');
 };

 const copyDescription=async(field:'customerDesc'|'supplierDesc')=>{
  try{await navigator.clipboard.writeText(generatedDescriptions(draft,(refs.company??[]).find(c=>c.id===draft.company))[field]);setNotice(`${field==='customerDesc'?'Customer':'Supplier'} description copied`)}
  catch{setError('Clipboard access is unavailable. Select and copy the description text directly.')}
 };
 const reload=async()=>{
  const run=++generation.current;setLoading(true);setReady(false);setError('');
  try {
   if(isLive) {const live=await import('./monday.ts');await live.confirmContext();adapter.current=live.liveAdapter;}
   const a=adapter.current;
   const[q,columns,companies,contacts,deals,projects]=await Promise.all([a.loadQuotes(),a.fetchColumns(),a.loadRefs(COMPANY_BOARD_ID),a.loadRefs(CONTACT_BOARD_ID),a.loadRefs(DEAL_BOARD_ID),a.loadRefs(PROJECT_BOARD_ID)]);
   if(run!==generation.current)return;
   setQuotes(q);setLookups(columns);setRefs({company:companies,contact:contacts,supplierContact:contacts,deal:deals,project:projects});setReady(true);lastReferenceRefresh.current=Date.now();
  }catch(e){if(run===generation.current)setError(e instanceof Error?e.message:String(e))}finally{if(run===generation.current)setLoading(false)}
 };
 const refreshReferences=async()=>{
  if(referenceRefreshRunning.current||!ready)return;
  const run=generation.current;referenceRefreshRunning.current=true;setRefreshingRefs(true);
  try{const a=adapter.current;const[columns,companies,contacts]=await Promise.all([a.fetchColumns(),a.loadRefs(COMPANY_BOARD_ID),a.loadRefs(CONTACT_BOARD_ID)]);if(run!==generation.current)return;setLookups(columns);setRefs(r=>({...r,company:companies,contact:contacts,supplierContact:contacts}));lastReferenceRefresh.current=Date.now();}
  catch(e){setError(`Reference refresh failed: ${e instanceof Error?e.message:String(e)}`)}
  finally{referenceRefreshRunning.current=false;setRefreshingRefs(false)}
 };
 useEffect(()=>{
  const refresh=()=>{if(document.visibilityState==='visible'&&Date.now()-lastReferenceRefresh.current>60000)void refreshReferences()};
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  return()=>{window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh)};
 },[ready]);
 useEffect(()=>{void reload();return()=>{generation.current++}},[]);
 const lookupRate=async()=>{setRateLoading(true);setRateError('');try{setRate(await fetchExchangeRate())}catch{setRateError('Rate unavailable — enter a quote rate manually.')}finally{setRateLoading(false)}};
 useEffect(()=>{void lookupRate()},[]);
 useEffect(()=>{if(rate&&defaultFxEligible.current&&!current){defaultFxEligible.current=false;setDraft(d=>({...d,fx:rate.adjusted,fxSource:rate.source}));setSaved(d=>({...d,fx:rate.adjusted,fxSource:rate.source}))}},[rate,current]);
 useEffect(()=>{
  const handler=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue=''}};
  window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);
 },[dirty]);
 const discard=()=>!dirty||window.confirm('Discard unsaved changes?');
 const select=(q:Quote)=>{if(busy||!discard())return;defaultFxEligible.current=false;setAutosavePaused(false);setCurrent(q.id);resetDraft({...q.values});setSaved({...q.values});setNotice('');setPreview(false)};
 const newDraft=()=>{if(busy||!discard())return;const d=newQuote(rate);defaultFxEligible.current=!rate;setAutosavePaused(false);setCurrent('');resetDraft(d);setSaved(d);setPreview(false);setNotice('New draft')};
 const duplicate=()=>{if(busy)return;defaultFxEligible.current=false;const d=duplicateDraft(draft);setAutosavePaused(false);setCurrent('');resetDraft(d);setSaved({...blank(),status:'Draft',visibility:'Private'});setNotice('Copy ready — save to create a separate draft');setPreview(false)};
 const save=async(automatic=false)=>{
  if(saveInProgress.current||busy||!ready||locked||(isLive&&!writesEnabled))return;
  saveInProgress.current=true;if(!automatic)setAutosavePaused(false);
  setSaving(true);setError('');setNotice('');let writtenId='';
  try {
   const a=adapter.current,original=quotes.find(q=>q.id===current);
   // Canonical contact-company links must already exist. Never repair by inference here.
   if(draft.contact&&!(refs.contact??[]).find(r=>r.id===draft.contact)?.companyIds?.includes(draft.company)) throw new Error('Customer contact is not linked to the selected company. Verify the canonical link in Monday.');
   if(draft.supplierContact) {
    const supplier=supplierCompany(draft.supplierDropdown,refs.company??[]);
    const contact=(refs.supplierContact??[]).find(r=>r.id===draft.supplierContact);
    if(!supplier||!contact?.companyIds?.includes(supplier.id)) throw new Error('Select a supplier contact with a verified link to the supplier company.');
   }
   let toSave=generatedDescriptions(draft,(refs.company??[]).find(c=>c.id===draft.company));
   try{toSave=applyCosting(toSave,calculate(toSave))}catch{/* Incomplete drafts remain saveable without fabricated totals. */}
   writtenId=await a.saveQuote(toSave,current||undefined,original?.updated_at);
   // Keep the created ID immediately; a failed refresh must never turn retry into another create.
   setCurrent(writtenId);resetDraft({...draft});setSaved({...draft});
   const q=await a.loadQuotes();setQuotes(q);const row=q.find(q=>q.id===writtenId);
   if(!row)throw new Error('Saved quotation was not found on readback. Refresh records before further editing.');
   resetDraft({...row.values});setSaved({...row.values});setNotice(automatic?(isLive?'Changes autosaved in Monday':'Demo changes autosaved'):(isLive?'Draft saved in Monday':'Demo draft saved for this preview session'));
  } catch(e) {setAutosavePaused(true);if(writtenId)setReady(false);setError(`${writtenId?'Save completed, but readback failed. Refresh before retrying. ':''}${e instanceof Error?e.message:String(e)}`)}finally{saveInProgress.current=false;setSaving(false)}
 };
 useEffect(()=>{
  if(!autosave||autosavePaused||!current||!dirty||busy||!ready||locked||(isLive&&!writesEnabled))return;
  try{validateDraft(draft)}catch{return}
  const timer=window.setTimeout(()=>void save(true),3000);
  return()=>window.clearTimeout(timer);
 },[autosave,autosavePaused,current,draft,dirty,busy,ready,locked]);
 const supplierId=supplierCompany(draft.supplierDropdown,refs.company??[])?.id??'';

 const supplierContacts=(refs.supplierContact??[]).filter(c=>!!supplierId&&c.companyIds?.includes(supplierId));
 const customerContacts=(refs.contact??[]).filter(c=>!!draft.company&&c.companyIds?.includes(draft.company));
 const company=(refs.company??[]).find(c=>c.id===draft.company),contact=customerContacts.find(c=>c.id===draft.contact);
 let costing:Costing|undefined,calculationError='';try{costing=calculate(draft)}catch(e){calculationError=e instanceof Error?e.message:String(e)}
 const editor={draft,set,disabled:locked||busy};
 const text=(field:Field,label:string,type:'text'|'number'='text')=><TextField key={field} {...editor} field={field} label={label} type={type}/>;
 const choice=(field:Field,label:string,options:Ref[])=><SelectField key={field} {...editor} field={field} label={label} options={options}/>;
 const dropdown=(field:Field,label:string)=>choice(field,label,(lookups[C[field]]??[]).map(v=>({id:v,name:v})));
 const generated=generatedDescriptions(draft,company);
 const quoteCompanyIds=new Set(quotes.map(q=>q.values.company));
 const filterCompanies=(refs.company??[]).filter(c=>quoteCompanyIds.has(c.id)).sort((a,b)=>a.name.localeCompare(b.name));
 const filtered=quotes.filter(q=>(!companyFilter||(companyFilter==='unassigned'?!q.values.company:q.values.company===companyFilter))&&`${q.name} ${q.values.status} ${q.values.packaging} ${(refs.company??[]).find(c=>c.id===q.values.company)?.name??''}`.toLowerCase().includes(query.toLowerCase()));
 const archive=async()=>{
  if(saveInProgress.current||busy||!ready||!current||(isLive&&!writesEnabled))return;
  if(!window.confirm(`Archive quotation ${draft.name}?${dirty?' Unsaved changes will be discarded.':''} It can be restored from Monday’s archive.`))return;
  saveInProgress.current=true;setSaving(true);setError('');let archived=false;
  try{const original=quotes.find(q=>q.id===current);if(!original)throw new Error('Reload before archiving.');await adapter.current.archiveQuote(current,original.updated_at);archived=true;setCurrent('');resetDraft(newQuote(rate));setSaved(newQuote(rate));setQuotes(await adapter.current.loadQuotes());setNotice('Quotation archived');}
  catch(e){if(archived)setReady(false);setError(`${archived?'Archive completed, but readback failed. Refresh records. ':''}${e instanceof Error?e.message:String(e)}`)}finally{saveInProgress.current=false;setSaving(false)}
 };

 return <main>
  <div className="banner"><img className="brand-logo" src={brandLogo} alt="Zero Pack" width={40} height={40}/><b>ZERO PACK <span>Quote Manager</span></b><div className="mode"><ShieldCheck size={14}/>{isLive?(writesEnabled?'Monday · Staff draft editor':'Monday · Read only'):'Demo preview · Synthetic data'}</div></div>
  <div className="workspace"><aside className="sidebar"><div className="sidebar-heading"><div><div className="eyebrow">WORKSPACE</div><h2>Quotations</h2></div><button className="small outline" disabled={busy} onClick={newDraft} aria-label="New quotation"><Plus size={18}/></button></div><label className="company-filter"><span>Company name</span><select aria-label="Filter quotations by company" value={companyFilter} onChange={e=>setCompanyFilter(e.target.value)}><option value="">All companies</option><option value="unassigned">Company not selected</option>{filterCompanies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="search"><Search size={16}/><input aria-label="Search quotations" placeholder="Search quotations…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="list-meta">{filtered.length} quotations</div><div className="quote-list">{filtered.map(q=><button disabled={busy} key={q.id} className={'quote '+(q.id===current?'active':'')} onClick={()=>select(q)}><strong>{q.name}</strong><small>{(refs.company??[]).find(c=>c.id===q.values.company)?.name||'Company not selected'}</small></button>)}{!loading&&!filtered.length&&<p className="muted">No quotations found.</p>}</div><button className="reload" disabled={busy} onClick={()=>{if(discard()){defaultFxEligible.current=!rate;setCurrent('');resetDraft(newQuote(rate));setSaved(newQuote(rate));void reload();void lookupRate()}}}><RefreshCw size={14}/> Refresh records</button><div className="sidebar-note">Staff workspace<br/>Private prototype board</div></aside>
  <section className="main"><header className="top"><div><div className="eyebrow">QUOTATIONS <ChevronRight size={12}/> {current?'EDIT QUOTATION':'NEW DRAFT'}</div><h1>{draft.name||'Quote Builder'}</h1></div><div className="actions"><label className="switch-label"><input role="switch" type="checkbox" aria-label="Autosave after first save" checked={autosave} onChange={e=>{setAutosave(e.target.checked);rememberAutosave(e.target.checked);setAutosavePaused(false)}}/><span className="switch-track" aria-hidden="true"/>Autosave</label><button className="outline small" disabled={busy||locked||!history.past.length} onClick={()=>{dispatch({type:'undo'});setNotice('')}} aria-label="Undo"><Undo2 size={16}/>Undo</button><button className="outline small" disabled={busy||locked||!history.future.length} onClick={()=>{dispatch({type:'redo'});setNotice('')}} aria-label="Redo"><Redo2 size={16}/>Redo</button><button className="outline small" disabled={busy||!dirty} onClick={()=>{resetDraft({...saved});setError('');setNotice('Unsaved changes discarded')}}>Discard</button><button className="outline" disabled={busy} onClick={duplicate}><Copy size={16}/> Duplicate</button><button className="primary" disabled={busy||!ready||locked||(isLive&&!writesEnabled)} onClick={()=>void save()}><Save size={16}/>{saving?'Saving…':isLive?'Save Draft':'Save Demo'}</button></div></header>
   <div className="messages" aria-live="polite">{loading&&<div className="message">Loading {isLive?'Monday records':'demo workspace'}…</div>}{error&&<div className="message error" role="alert">{error}</div>}{notice&&<div className="message success">{notice}</div>}{locked&&<div className="message warning">This quotation is locked. Duplicate it to start a new draft.</div>}{dirty&&<div className="dirty">● Unsaved changes{autosave?(!current?' · Save once to start autosave':autosavePaused?' · Autosave paused — save manually to retry':' · Autosave after 3 seconds without edits'):''}</div>}</div>
   <div className="tabs"><button className={!preview?'selected':''} onClick={()=>setPreview(false)}>Quote workspace</button><button className={preview?'selected':''} onClick={()=>setPreview(true)}>Customer description preview</button></div>
   <div className="content">{preview?<CustomerPreview draft={generated}/>:<>
    <div className="identity-grid">
     <Panel title="Quote details"><div className="stack-fields">{text('name','Quote reference')}{choice('status','Quote status',['Draft','Costing','Review','Ready to Issue','Declined','Expired'].map(v=>({id:v,name:v})))}{choice('deal','Deal',refs.deal??[])}{choice('project','Client project',refs.project??[])}{text('artwork','Artwork design reference')}</div></Panel>
     <Panel title="Customer"><div className="stack-fields">{choice('company','Customer company',refs.company??[])}{choice('contact','Customer contact',customerContacts)}<div className="fields cols2"><ReadField label="First name" value={contact?.firstName??''}/><ReadField label="Last name" value={contact?.lastName??''}/></div><ReadField label="Email" value={contact?.email??''}/><ReadField label="Contact number" value={contact?.phone||company?.companyPhone||''}/></div></Panel>
     <Panel title="Shipping details"><div className="stack-fields"><label className="field address-field"><textarea aria-label="Shipping address" rows={3} value={company?.shippingAddress??''} readOnly placeholder="No shipping address recorded on this company"/></label>{!company?.shippingAddress&&company?.businessAddress&&<ReadField label="Business address · Shipping not confirmed" value={company.businessAddress}/>}<button className="outline shipping-copy" disabled={busy||!company?.shippingAddress||!draft.weight||!draft.cbm||!draft.quantity||!draft.packaging} onClick={async()=>{try{await navigator.clipboard.writeText(shippingQuote(draft,company));setNotice('Shipping quote copied')}catch(e){setError(e instanceof Error?e.message:'Clipboard access is unavailable.')}}}>Copy shipping quote</button></div></Panel>
    </div>
    <Panel title="Packaging specifications & costing" eyebrow="Staff only">
     <div className="quote-form-grid">
      <div className="specification-column"><h3>Packaging</h3><div className="row-fields"><div className="supplier-row">{choice('supplierDropdown','Supplier',supplierOptions(lookups[C.supplierDropdown]??[],refs.company??[]))}<button className="outline small" disabled={busy||refreshingRefs} aria-label="Refresh suppliers and contacts" onClick={()=>void refreshReferences()}><RefreshCw size={12}/></button></div>{choice('supplierContact','Supplier contact',supplierContacts)}{dropdown('colour','Colour')}{dropdown('packaging','Packaging type')}{dropdown('printing','Printing')}{text('size','Size')}{text('microns','Thickness (microns)','number')}{dropdown('style','Style')}{text('quantity','Supplier quantity','number')}{text('usdUnit','Supplier USD / unit','number')}<div className="exchange-row"><TextField {...editor} field="fx" label="Exchange Rate" type="number"/><div className="current-rate"><input aria-label="Current base exchange rate" readOnly value={rate?.base??'—'} className={rateColour(draft.fx,rate)} title={rate?`ECB ${rate.date} · AUD per USD · new quotes use ${rate.adjusted} (+5%)`:'Latest published AUD per USD'}/><button className="outline small" disabled={rateLoading} onClick={()=>void lookupRate()} aria-label="Refresh exchange rate"><RefreshCw size={12}/></button></div></div><p className="hint exchange-hint">{rateError||(rateLoading?'Looking up current rate…':`Current base · ${rate?.date} · default +5%`)}</p>{text('transaction','Plate Fee USD','number')}{draft.pricingVersion&&!/^quote-v[23]-/.test(draft.pricingVersion)&&<p className="hint warning-text">This quote predates USD plate fees. Verify the plate amount in USD before recalculating.</p>}<ReadField label="AUD / unit" value={costing?.audUnit??''}/>{text('sellQuantity','Sell quantity','number')}{text('markup','Markup %','number')}</div>{draft.supplierDropdown&&!supplierId&&<p className="hint warning-text">Verify the supplier’s canonical company link before choosing a contact.</p>}<button className="outline apply-calculation" disabled={!costing||locked||busy} onClick={()=>{setDraft(d=>applyCosting(d,costing!));setNotice('Calculation applied to this draft. Save to retain the snapshot.')}}>Re-calculate</button></div>
      <div className="costing-column"><h3>Shipping & import costs</h3><div className="fields cols2 freight-size">{text('weight','Weight (kg)','number')}{text('cbm','CBM','number')}</div><div className="fields cols2 charges">{text('shipping','Shipping USD','number')}{text('bank','Bank fees USD','number')}<ReadField label="Insurance USD" value={costing?.insuranceUSD??''}/><ReadField label="Insurance AUD" value={costing?.insuranceAUD??''}/>{text('duty','Customs duty AUD','number')}{text('customs','Customs fees AUD','number')}</div><ReadField label="Shipping total AUD" value={costing?money(costing.freightAUD):''}/>
       <h3>Calculated totals</h3><div className="row-fields calculation-totals"><ReadField label="Total USD" value={costing?.totalUSD??'—'}/><ReadField label="Total AUD" value={costing?.totalAUD??'—'}/><ReadField label="Cost per unit AUD" value={costing?.costUnitAUD??'—'}/><ReadField label="Total product cost AUD" value={costing?.productCostAUD??'—'}/><ReadField label="Selling price / unit AUD" value={costing?.productSellUnitAUD??'—'}/><ReadField label="Total selling AUD" value={costing?.productSellAUD??'—'}/><ReadField label="Margin AUD" className={costing&&Number(costing.profitAUD)<500?'low-margin':''} value={costing?.profitAUD??'—'}/><ReadField label="Sell Incl Shipping AUD" places={4} value={costing?.allInUnitAUD??'—'} action={<button className="outline small" disabled={!costing} aria-label="Copy Sell Incl Shipping AUD" onClick={async()=>{try{await navigator.clipboard.writeText(costing!.allInUnitAUD);setNotice('Sell including shipping copied')}catch{setError('Clipboard access is unavailable. Select and copy the value directly.')}}}>Copy</button>}/><ReadField label="Total landed cost AUD" value={costing?.landedAUD??'—'}/><ReadField label="Total landing sell AUD" value={costing?.allInTotalAUD??'—'}/></div>{calculationError&&<p className="hint">{calculationError}</p>}
      </div>
      <div className="description-column">{(['supplierDesc','customerDesc'] as const).map(field=><React.Fragment key={field}><div className="description-heading"><h3>{field==='supplierDesc'?'Supplier description':'Customer description'}</h3><div className="description-buttons"><button className="outline small" disabled={locked||busy} onClick={()=>{setDraft(d=>generatedDescriptions(d,company));setNotice('Descriptions updated from specifications')}} aria-label={`Update ${field==='supplierDesc'?'supplier':'customer'} description`}>Update</button><button className="outline small" disabled={!generated[field]} onClick={()=>void copyDescription(field)} aria-label={`Copy ${field==='supplierDesc'?'supplier':'customer'} description`}>Copy</button></div></div><label className="field"><textarea aria-label={field==='supplierDesc'?'Supplier description · Internal':'Customer description'} rows={5} readOnly value={generated[field]}/></label></React.Fragment>)}<div className="description-heading"><h3>Internal notes</h3></div><TextArea {...editor} field="notes" label="Internal notes"/></div>
     </div>
     <div className="cost-summary" aria-label="Cost summary"><div><span>Product cost AUD</span><b>{costing?money(costing.productCostAUD):'—'}</b></div><div><span>Freight & import costs AUD</span><b>{costing?money(costing.freightAUD):'—'}</b></div><div><span>Total landed AUD</span><b>{costing?money(costing.landedAUD):'—'}</b></div><div><span>Margin AUD</span><b>{costing?money(costing.profitAUD):'—'}</b><small>Product margin {costing?`${costing.marginPercent}%`:'—'}</small></div><div><span>Total landing sell AUD</span><b>{costing?money(costing.allInTotalAUD):'—'}</b></div></div>
     <div className="record-actions"><button className="archive-button" disabled={busy||!ready||!current||(isLive&&!writesEnabled)} onClick={()=>void archive()}>Archive quotation</button></div>
    </Panel>
   </>}<footer><span>Zero Pack Quote Manager · v0.3.2</span><span>{isLive?'Private Monday workspace':'Demo changes reset when this page reloads'} · Draft only</span></footer></div>
  </section></div>
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
