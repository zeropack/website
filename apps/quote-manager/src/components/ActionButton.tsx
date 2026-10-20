import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Check} from 'lucide-react';
export function ActionButton({children,onAction,resetKey,...props}:{children:ReactNode;onAction:()=>boolean|void|Promise<boolean|void>;resetKey?:string;className?:string;disabled?:boolean;'aria-label'?:string}) {
 const [success,setSuccess]=useState(false),[pending,setPending]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),generation=useRef(0),running=useRef(false);
 useEffect(()=>{generation.current++;setSuccess(false);if(timer.current)clearTimeout(timer.current);return()=>{generation.current++;if(timer.current)clearTimeout(timer.current)}},[resetKey]);
 const run=async()=>{
  if(running.current)return;running.current=true;setPending(true);setSuccess(false);
  const version=generation.current;if(timer.current)clearTimeout(timer.current);
  try{const result=await onAction();if(result!==false&&version===generation.current){setSuccess(true);timer.current=setTimeout(()=>setSuccess(false),3000)}}
  catch{/* The caller owns its error display. A failed action never shows a success tick. */}
  finally{running.current=false;setPending(false)}
 };
 return <button {...props} disabled={props.disabled||pending} onClick={()=>void run()}>{success&&<Check size={14} className="action-success" aria-hidden="true"/>}{children}</button>;
}
