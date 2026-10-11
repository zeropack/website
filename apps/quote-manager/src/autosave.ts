const PREFERENCE='zero-pack-quote-manager:autosave';
export function autosavePreference():boolean {try{return localStorage.getItem(PREFERENCE)==='true'}catch{return false}}
export function rememberAutosave(enabled:boolean):void {try{localStorage.setItem(PREFERENCE,String(enabled))}catch{/* Saving still works if preference storage is blocked. */}}
