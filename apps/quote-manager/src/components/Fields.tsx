import {useState,type ReactNode} from 'react';
import {flushSync} from 'react-dom';
import {currencyValue,numberValue} from '../currency.ts';
import {normalizeDecimal} from '../numeric.ts';
import type {Draft,Field} from '../schema.ts';
import type {Ref} from '../adapter.ts';
export type EditorProps={draft:Draft;set:(key:Field,value:string)=>void;disabled?:boolean};
export function TextField({draft,set,disabled,field,label,type='text',placeholder}:EditorProps & {field:Field;label:string;type?:'text'|'number';placeholder?:string}) {
 const [focused,setFocused]=useState(false);
 const unitFields=['usdUnit','audUnit','sellUnit'];
 const currencies:Partial<Record<Field,'USD'|'AUD'>>={usdUnit:'USD',shipping:'USD',insurance:'USD',bank:'USD',transaction:'USD',duty:'AUD',customs:'AUD',audUnit:'AUD',landed:'AUD',sellUnit:'AUD'};
 const currency=currencies[field],numeric=type==='number',value=!focused&&numeric?(currency?currencyValue(draft[field],currency,unitFields.includes(field)?4:2):numberValue(draft[field])):draft[field];
 return <label className={type==='number'?'field number-field':'field'}><span>{label}</span><input data-draft-field="true" aria-label={label} value={value} onFocus={e=>{if(numeric){flushSync(()=>setFocused(true));e.currentTarget.select()}else setFocused(true)}} onBlur={()=>{if(numeric&&normalizeDecimal(draft[field])!==draft[field])set(field,normalizeDecimal(draft[field]));setFocused(false)}} onChange={e=>set(field,numeric?e.target.value.replace(/(?:USD|AUD|\$|,|\s)/g,'').replace(/^\.(\d)/,'0.$1'):e.target.value)} type={numeric?'text':type} inputMode={type==='number'?'decimal':undefined} step={type==='number'&&!currency?'any':undefined} min={type==='number'&&!currency?'0':undefined} disabled={disabled} placeholder={placeholder}/></label>;
}
export function SelectField({draft,set,disabled,field,label,options}:EditorProps & {field:Field;label:string;options:Ref[]}) {
 const missing=draft[field]&&!options.some(o=>o.id===draft[field]);
 return <label className="field"><span>{label}</span><select data-draft-field="true" aria-label={label} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}><option value="">Select…</option>{missing&&<option value={draft[field]}>{draft[field]} (retained existing value)</option>}{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>;
}
export function ReadField({label,value,displayLabel,places,className='',action}:{label:string;value:string;displayLabel?:string;places?:number;className?:string;action?:ReactNode}) {return <div className={`field read-field ${className}`}><span>{displayLabel??label}</span><div className="read-control"><input aria-label={label} value={/AUD|USD/.test(label)?currencyValue(value,label.includes('USD')?'USD':'AUD',places??(label.includes('unit')?4:2)):value} readOnly placeholder="Not recorded"/>{action}</div></div>}
export function TextArea({draft,set,disabled,field,label}:EditorProps & {field:Field;label:string}) {return <label className="field"><span>{label}</span><textarea data-draft-field="true" aria-label={label} rows={5} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}/></label>}
export function Panel({title,eyebrow,children}: {title:string;eyebrow?:string;children:ReactNode}) {return <section className="panel"><div className="panel-title"><h2>{title}</h2>{eyebrow&&<span className="pill">{eyebrow}</span>}</div>{children}</section>}
