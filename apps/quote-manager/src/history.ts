import type {Draft} from './schema.ts';
export type History={past:Draft[];present:Draft;future:Draft[]};
export type HistoryAction={type:'edit';value:Draft|((d:Draft)=>Draft)}|{type:'reset';value:Draft}|{type:'undo'}|{type:'redo'};
export const startHistory=(value:Draft):History=>({past:[],present:value,future:[]});
export function historyReducer(state:History,action:HistoryAction):History {
 if(action.type==='reset')return startHistory(action.value);
 if(action.type==='undo') {const previous=state.past.at(-1);return previous?{past:state.past.slice(0,-1),present:previous,future:[state.present,...state.future]}:state;}
 if(action.type==='redo') {const next=state.future[0];return next?{past:[...state.past,state.present].slice(-100),present:next,future:state.future.slice(1)}:state;}
 const value=typeof action.value==='function'?action.value(state.present):action.value;
 return JSON.stringify(value)===JSON.stringify(state.present)?state:{past:[...state.past,state.present].slice(-100),present:value,future:[]};
}
