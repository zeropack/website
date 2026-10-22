// The embedded Monday view can block the async Clipboard API despite a user click.
export async function copyText(text:string):Promise<void> {
 try{await navigator.clipboard.writeText(text);return}catch{/* Try the user-initiated selection fallback. */}
 const previous=document.activeElement,selection=document.getSelection(),ranges=selection?Array.from({length:selection.rangeCount},(_,i)=>selection.getRangeAt(i).cloneRange()):[];
 const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(area);
 let copied=false;
 try{area.select();copied=document.execCommand('copy')}catch{/* Manual copy is offered by the caller. */}finally{area.remove();if(previous instanceof HTMLElement)previous.focus();if(selection){selection.removeAllRanges();for(const range of ranges)selection.addRange(range)}}
 if(!copied)throw new Error('Clipboard access is unavailable. Select the shipping details below and copy them manually.');
}
