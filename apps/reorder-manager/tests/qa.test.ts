import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../src/mock.ts';
import {QA_ID,qaProfile} from '../src/qa.ts';
import {blockReason} from '../src/model.ts';
const staff={id:'1',name:'Internal reviewer',email:'qa@zeropack.co'};
function qa(){return {...fixture(),id:QA_ID,kind:'QA',companyId:'',projectIds:[],previousIds:[],active:true};}
test('QA requires the exact excluded unlinked fixture and internal staff',()=>{
 const p=qaProfile(qa(),staff);assert.equal(p.isQa,true);assert.equal(p.contact?.email,staff.email);assert.equal(blockReason(p),'');
 for(const patch of [{id:'real-profile'},{kind:'Verified Profile'},{companyId:'real-company'},{projectIds:['real-project']}])assert.throws(()=>qaProfile({...qa(),...patch},staff),/excluded/);
 assert.throws(()=>qaProfile(qa(),{...staff,email:'customer@example.invalid'}),/staff/);
});
test('QA respects persisted pause and skip',()=>{
 assert.match(blockReason(qaProfile({...qa(),active:false},staff)),/paused/);
 assert.match(blockReason(qaProfile({...qa(),review:'Skipped'},staff)),/skipped/);
});
