import type {ReactNode} from 'react';
import type {Draft,Field} from '../schema.ts';
import type {Ref} from '../adapter.ts';
export type EditorProps={draft:Draft;set:(key:Field,value:string)=>void;disabled?:boolean};
export function TextField({draft,set,disabled,field,label,type='text',placeholder}:EditorProps & {field:Field;label:string;type?:'text'|'number';placeholder?:string}) {
 return <label className={type==='number'?'field number-field':'field'}><span>{label}</span><input aria-label={label} value={draft[field]} onChange={e=>set(field,e.target.value)} type={type} step={type==='number'?'any':undefined} min={type==='number'?'0':undefined} disabled={disabled} placeholder={placeholder}/></label>;
}
export function SelectField({draft,set,disabled,field,label,options}:EditorProps & {field:Field;label:string;options:Ref[]}) {
 const missing=draft[field]&&!options.some(o=>o.id===draft[field]);
 return <label className="field"><span>{label}</span><select aria-label={label} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}><option value="">Select…</option>{missing&&<option value={draft[field]}>{draft[field]} (retained existing value)</option>}{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>;
}
export function ReadField({label,value}:{label:string;value:string}) {return <label className="field read-field"><span>{label}</span><input aria-label={label} value={value} readOnly placeholder="Not recorded"/></label>}
export function TextArea({draft,set,disabled,field,label}:EditorProps & {field:Field;label:string}) {return <label className="field"><span>{label}</span><textarea aria-label={label} rows={5} value={draft[field]} disabled={disabled} onChange={e=>set(field,e.target.value)}/></label>}
export function Panel({title,eyebrow,children}: {title:string;eyebrow?:string;children:ReactNode}) {return <section className="panel"><div className="panel-title"><h2>{title}</h2>{eyebrow&&<span className="pill">{eyebrow}</span>}</div>{children}</section>}
