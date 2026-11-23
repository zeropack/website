import test from 'node:test';import assert from 'node:assert/strict';
import {decodeRef} from '../src/adapter.ts';
import {relatedDeals,relatedProjects} from '../src/related.ts';
import {CONTACT_BOARD_ID,DEAL_BOARD_ID,PROJECT_BOARD_ID} from '../src/schema.ts';
import {createMockAdapter} from '../src/mock.ts';

test('Monday project company and deal contact/project relations decode as IDs',()=>{
 const item={id:'5',name:'Linked',updated_at:'',column_values:[{id:'deal_contact',text:null,value:null,type:'board_relation',linked_item_ids:['7']},{id:'board_relation_mm67vcvr',text:null,value:null,type:'board_relation',linked_item_ids:['8']},{id:'board_relation_mm6471v8',text:null,value:null,type:'board_relation',linked_item_ids:['9']} ]};
 const ref=decodeRef(item);assert.deepEqual(ref.contactIds,['7']);assert.deepEqual(ref.projectIds,['8']);assert.deepEqual(ref.companyIds,['9']);
});
test('deal and project choices require a consistent verified company link',async()=>{
 const a=createMockAdapter();const[contacts,deals,projects]=await Promise.all([a.loadRefs(CONTACT_BOARD_ID),a.loadRefs(DEAL_BOARD_ID),a.loadRefs(PROJECT_BOARD_ID)]);
 assert.deepEqual(relatedDeals('101',deals,contacts,projects).map(x=>x.id),['301']);assert.deepEqual(relatedProjects('101',projects).map(x=>x.id),['401']);
 assert.deepEqual(relatedDeals('103',deals,contacts,projects).map(x=>x.id),['302']);assert.deepEqual(relatedProjects('103',projects).map(x=>x.id),['402']);
 assert.deepEqual(relatedDeals('',deals,contacts,projects),[]);assert.deepEqual(relatedProjects('',projects),[]);
 assert.deepEqual(relatedDeals('101',[{id:'304',name:'Conflict',contactIds:['201'],projectIds:['402']}],contacts,projects),[]);
});
