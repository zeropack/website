import {useState,type ReactNode} from 'react';
import {flushSync} from 'react-dom';
import {currencyValue} from '../currency.ts';
import type {Draft,Field} from '../schema.ts';
import type {Ref} from '../adapter.ts';
export type EditorProps={draft:Draft;set:(key:Field,value:string)=>void;disabled?:boolean};
export function TextField({draft,set,disabled,field,label,type='text',placeholder}:EditorProps & {field:Field;label:string;type?:'text'|'number';placeholder?:string}) {
 const [focused,setFocused]=useState(false);
 const unitFields=['usdUnit','audUnit','sellUnit'];
 const currencies:Partial<Record<Field,'USD'|'AUD'>>={usdUnit:'USD',shipping:'USD',insurance:'USD',bank:'USD',transaction:'AUD',duty:'AUD',customs:'AUD',audUnit:'AUD',landed:'AUD',sellUnit:'AUD'};
 const currency=currencies[field],value=currency&&!focused?currencyValue(draft[field],currency,unitFields.includes(field)?4:2):draft[field];
 return <label className={type==='number'?'field number-field':'field'}><span>{label}</span><input aria-label={label} value={value} onFocus={e=>{if(currency){flushSync(()=>setFocused(true));e.currentTarget.select()}else setFocused(true)}} onBlur={()=>setFocused(false)} onChange={e=>set(field,currency?e.target.value.replace(/(?:USD|AUD|\$|,|\s)/g,''):e.target.value)} type={currency?'text':type} inputMode={type==='number'?'decimal':undefined} step={type==='number'&&!currency?'any':undefined} min={type==='number'&&!currency?'0':undefined} disabled={disabled} placeholder={placeholder}/></label>;
}
export function SelectField({draft,set,disabled,field,label,options}:EditorProps & {field:Field;label:string;options:Ref[]}) {
 const missing=draft[field]&&!options.some(o=>o.id===draft[field]);
 return <label className="field"><span>{label}</span><select aria-label={label} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}><option value="">Select…</option>{missing&&<option value={draft[field]}>{draft[field]} (retained existing value)</option>}{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>;
}
export function ReadField({label,value,displayLabel}:{label:string;value:string;displayLabel?:string}) {return <label className="field read-field"><span>{displayLabel??label}</span><input aria-label={label} value={/AUD|USD/.test(label)?currencyValue(value,label.includes('USD')?'USD':'AUD',label.includes('unit')?4:2):value} readOnly placeholder="Not recorded"/></label>}
export function TextArea({draft,set,disabled,field,label}:EditorProps & {field:Field;label:string}) {return <label className="field"><span>{label}</span><textarea aria-label={label} rows={5} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}/></label>}
export function Panel({title,eyebrow,children}: {title:string;eyebrow?:string;children:ReactNode}) {return <section className="panel"><div className="panel-title"><h2>{title}</h2>{eyebrow&&<span className="pill">{eyebrow}</span>}</div>{children}</section>}
