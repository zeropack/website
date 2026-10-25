import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeSnapshot,decodeSnapshot} from '../src/codec.ts';
import {generate} from '../src/model.ts';
import {fixture,templates} from '../src/mock.ts';
test('Snapshot preserves Unicode, HTML attributes and approval evidence',async()=>{const d=await generate(fixture(),templates);d.body+='\n\n150 × 220mm — café & tea';d.approvedAt='2026-10-25T00:00:00Z';d.approvedBy='reviewer-1';const encoded=encodeSnapshot(d);assert.doesNotMatch(encoded,/[<>"']/);assert.deepEqual(decodeSnapshot(encoded),d)});
test('Corrupt, unsupported and oversized snapshots fail closed',()=>{assert.throws(()=>decodeSnapshot('{"schema":1}'),/invalid/);assert.throws(()=>decodeSnapshot('zp-review-v1:broken'),/invalid/);assert.equal(decodeSnapshot(''),null)});
