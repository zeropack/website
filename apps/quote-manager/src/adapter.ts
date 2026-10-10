import { C, QUOTE_BOARD_ID, blank, dropdowns, relations, longs, statuses, numbers, type Draft, type Field } from './schema.ts';

export type ColumnValue = { id: string; text: string | null; value: string | null; type: string; linked_item_ids?: string[]; values?: {id: number; label: string}[] };
export type Item = { id: string; name: string; updated_at: string; column_values: ColumnValue[] };
export type Quote = {id: string; name: string; values: Draft; updated_at: string};
export type Ref = {id: string; name: string; companyIds?: string[]; status?: string; primaryContactIds?:string[]; shippingAddress?:string; businessAddress?:string; companyPhone?:string; firstName?:string; lastName?:string; email?:string; phone?:string};
export type Column = {id: string; type: string; settings_str: string};
export type Transport = (query: string, variables: Record<string, unknown>) => Promise<{data?: unknown; errors?: {message: string}[]}>;
export const VALUE_FIELDS = 'id text value type ... on BoardRelationValue { linked_item_ids } ... on DropdownValue { values { id label } }';
export const QUOTE_FIELDS = `id name updated_at column_values { ${VALUE_FIELDS} }`;
export const REF_FIELDS = 'id name updated_at column_values(ids:["contact_account","status","board_relation_mm4nz01g","location_mm4nwpvd","location_mm4na6br","phone_mm5gch4a","text_mm5n6d0w","text_mm4pxvbs","contact_email","contact_phone"]){id text value type ... on BoardRelationValue{linked_item_ids}}';
export function decodeRef(i:Item):Ref {
 const col=(id:string)=>i.column_values.find(c=>c.id===id),text=(id:string)=>col(id)?.text??'';
 return {id:i.id,name:i.name,companyIds:col('contact_account')?.linked_item_ids??[],status:text('status'),primaryContactIds:col('board_relation_mm4nz01g')?.linked_item_ids??[],shippingAddress:text('location_mm4nwpvd'),businessAddress:text('location_mm4na6br'),companyPhone:text('phone_mm5gch4a'),firstName:text('text_mm5n6d0w'),lastName:text('text_mm4pxvbs'),email:text('contact_email'),phone:text('contact_phone')};
}
export const COLUMN_QUERY = 'query($ids:[ID!]!){boards(ids:$ids){id board_kind columns{id type settings_str}}}';
export const FIRST_QUERY = `query($ids:[ID!]!,$limit:Int!){boards(ids:$ids){id items_page(limit:$limit){cursor items{${QUOTE_FIELDS}}}}}`;
export const NEXT_QUERY = `query($cursor:String!,$limit:Int!){next_items_page(cursor:$cursor,limit:$limit){cursor items{${QUOTE_FIELDS}}}}`;
const fieldByColumn = new Map<string,Field>(Object.entries(C).map(([k,v]) => [v,k as Field]));
const safeJSON = (v: string | null) => {try {return JSON.parse(v || '{}')} catch {return {}}};
export function decode(item: Item): Quote {
 const draft = blank(); draft.name = item.name;
 for (const col of item.column_values) {
  const key = fieldByColumn.get(col.id); if (!key || key === 'name') continue;
  const raw = safeJSON(col.value);
  if (relations.includes(key)) {
   const ids = col.linked_item_ids ?? raw.item_ids ?? raw.linkedPulseIds?.map((v: {linkedPulseId: number}) => String(v.linkedPulseId)) ?? [];
   if(ids.length > 1) throw new Error(`Quote ${item.id}: ${key} has multiple links; review in Monday before editing.`);
   draft[key] = String(ids[0] ?? '');
  } else if (dropdowns.includes(key)) {
   const labels = col.values?.map(v => v.label) ?? raw.labels ?? (col.text ? [col.text] : []);
   if(labels.length > 1) throw new Error(`Quote ${item.id}: ${key} has multiple values; review in Monday before editing.`);
   draft[key] = labels[0] ?? '';
  } else draft[key] = col.text ?? '';
 }
 return {id: item.id, name: item.name, updated_at: item.updated_at, values: draft};
}
export function columnOptions(columns: Column[]): Record<string,string[]> {
 return Object.fromEntries(columns.map(c => {
  const settings = safeJSON(c.settings_str);
  const deactivated = new Set((settings.deactivated_labels ?? []).map(String));
  const labels = Array.isArray(settings.labels)
   ? settings.labels.filter((v: {id?: number}) => !deactivated.has(String(v.id))).map((v: string | {name?: string; label?: string}) => typeof v === 'string' ? v : v.name ?? v.label ?? '')
   : Object.entries(settings.labels ?? {}).filter(([id])=>!deactivated.has(id)).map(([,v])=>String(v));
  return [c.id, labels.filter(Boolean)];
 }));
}
export const EDITABLE_STATUSES = ['Draft','Costing','Review','Ready to Issue','Declined','Expired'];
export const isEditable = (status: string) => EDITABLE_STATUSES.includes(status);
export function validateDraft(d: Draft): void {
 if(!d.name.trim()) throw new Error('Quote reference is required.');
 if(!isEditable(d.status)) throw new Error('This quotation is locked; duplicate it into a new draft.');
 for(const k of numbers) {
  const v=d[k].trim();
  if(v && (!/^\d+(\.\d+)?$/.test(v) || !Number.isFinite(Number(v)))) throw new Error(`${k} must be a finite, non-negative decimal number.`);
 }
 for(const k of ['quantity','sellQuantity'] as Field[]) if(d[k] && !Number.isSafeInteger(Number(d[k]))) throw new Error(`${k} must be a whole number.`);
 if(d.fx && Number(d.fx)<=0) throw new Error('Exchange rate must be greater than zero.');
 for(const k of relations) if(d[k] && (!/^\d+$/.test(d[k]) || !Number.isSafeInteger(Number(d[k])))) throw new Error(`${k} must be an existing Monday item ID.`);
}
export function toValues(d: Draft, creating=false): Record<string,unknown> {
 const out: Record<string,unknown> = {};
 for(const [key,col] of Object.entries(C) as [Field,string][]) {
  if(['name','qboId','qboUrl','legacy','visibility'].includes(key)) continue;
  const v=d[key].trim();
  if(relations.includes(key)) out[col]={item_ids:v?[Number(v)]:[]};
  else if(dropdowns.includes(key)) out[col]=v?{labels:[v]}:{ids:[]};
  else if(statuses.includes(key)) out[col]=v?{label:v}:null;
  else if(longs.includes(key)) out[col]={text:v};
  else if(numbers.includes(key)) out[col]=v||null;
  else out[col]=v;
 }
 if(creating) out[C.visibility]={label:'Private'};
 return out;
}
export function duplicateDraft(d: Draft): Draft {
 return {...d,name:`${d.name||'Untitled'} — Copy`,status:'Draft',visibility:'Private',legacy:'',qboId:'',qboUrl:''};
}
type Page = {cursor: string | null; items: Item[]};
export function createMondayAdapter(transport: Transport, writesEnabled=false) {
 async function gql<T>(query: string, variables: Record<string,unknown>={}): Promise<T> {
  const r=await transport(query, variables);
  if(r.errors?.length) throw new Error(r.errors.map(e=>e.message).join('; '));
  if(!r.data) throw new Error('Monday returned no data. Check app permissions and board access.');
  return r.data as T;
 }
 async function fetchColumns() {
  const d=await gql<{boards:{id:string;board_kind:string;columns:Column[]}[]}>(COLUMN_QUERY,{ids:[String(QUOTE_BOARD_ID)]});
  const b=d.boards.find(b=>b.id===String(QUOTE_BOARD_ID));
  if(!b) throw new Error('Quotations Prototype board is unavailable to this user.');
  if(b.board_kind!=='private') throw new Error('Quote Builder requires the private prototype board.');
  for(const [k,id] of Object.entries(C)) {
   if(k==='name') continue;
   if(!b.columns.some(c=>c.id===id)) throw new Error(`Missing prototype field: ${k}. No schema changes were made.`);
  }
  return columnOptions(b.columns);
 }
 async function readItems(boardId: number, refsOnly=false): Promise<Item[]> {
  const fields=refsOnly?REF_FIELDS:QUOTE_FIELDS;
  const firstQuery=refsOnly?FIRST_QUERY.replace(QUOTE_FIELDS,fields):FIRST_QUERY;
  const nextQuery=refsOnly?NEXT_QUERY.replace(QUOTE_FIELDS,fields):NEXT_QUERY;
  const out: Item[]=[]; let cursor: string|null=null; const seen = new Set<string>();
  for(let page=0;page<40;page++) {
   let p: Page;
   if(page===0) {
    const d=await gql<{boards:{id:string;items_page:Page}[]}>(firstQuery,{ids:[String(boardId)],limit:100});
    const b=d.boards.find(b=>b.id===String(boardId));
    if(!b) throw new Error(`Board ${boardId} is unavailable. Partial records cannot be used.`);
    p=b.items_page;
   } else {
    const d=await gql<{next_items_page:Page}>(nextQuery,{cursor,limit:100}); p=d.next_items_page;
   }
   out.push(...p.items); cursor=p.cursor;
   if(!cursor) return out;
   if(seen.has(cursor)) throw new Error(`Board ${boardId} returned a repeated cursor.`);
   seen.add(cursor);
  }
  throw new Error(`Board ${boardId} exceeds the safe paging budget. No partial list was returned.`);
 }
 async function loadQuotes() {return (await readItems(QUOTE_BOARD_ID)).map(decode)}
 async function loadRefs(boardId: number): Promise<Ref[]> {
  return (await readItems(boardId,true)).map(decodeRef);
 }
 async function saveQuote(d: Draft, id?: string, expectedUpdatedAt?: string) {
  if(!writesEnabled) throw new Error('Monday writes are disabled in this build.');
  validateDraft(d);
  await fetchColumns(); // Fail closed on inaccessible/non-private board or schema drift.
  if(id) {
   if(!expectedUpdatedAt) throw new Error('Reload the quotation before saving.');
   const r=await gql<{items:(Item & {board:{id:string}})[]}>(`query($ids:[ID!]!){items(ids:$ids){${QUOTE_FIELDS} board{id}}}`,{ids:[id]});
   const prior=r.items.find(i=>i.id===id);
   if(!prior || prior.board.id!==String(QUOTE_BOARD_ID)) throw new Error('Quotation is unavailable on the prototype board.');
   if(!isEditable(decode(prior).values.status)) throw new Error('This quotation is locked; duplicate it instead.');
   if(prior.updated_at!==expectedUpdatedAt) throw new Error('This quotation changed in Monday. Reload before saving.');
   // Monday has no conditional mutation; this optimistic read does not eliminate a simultaneous edit race.
   await gql('mutation($board:ID!,$item:ID!,$vals:JSON!){change_multiple_column_values(board_id:$board,item_id:$item,column_values:$vals){id}}',
    {board:String(QUOTE_BOARD_ID),item:id,vals:JSON.stringify({...toValues(d),name:d.name.trim()})});
   return id;
  }
  const r=await gql<{create_item:{id:string}}>('mutation($board:ID!,$name:String!,$vals:JSON!){create_item(board_id:$board,item_name:$name,column_values:$vals){id}}',
   {board:String(QUOTE_BOARD_ID),name:d.name.trim(),vals:JSON.stringify(toValues(d,true))});
  return r.create_item.id;
 }
 return {fetchColumns,loadQuotes,loadRefs,saveQuote};
}
