const assert=require('node:assert/strict');
const tools=require('../assets/js/report-list-tools');
const report={id:'report_ABC-123',accessAccount:{name:'张同学',username:'mnHELLO'},studentProfile:{grade:'G11'},recommendations:[{name:'数学'},{name:'物理'},{name:'计算机'}]};
assert(tools.matches(report,'张同学 mnhello G11'));assert(tools.matches(report,'abc-123'));assert(tools.matches(report,'计算机'));
assert(!tools.matches(report,'张同学 医学'));assert(tools.matches({},''));
const rows=Array.from({length:45},(_,id)=>({id}));
assert.deepEqual(tools.paginate(rows,2,20).items.map(x=>x.id),Array.from({length:20},(_,i)=>i+20));
assert.equal(tools.paginate(rows,9,20).page,3);assert.equal(tools.paginate(rows,9,20).end,45);
assert.equal(tools.paginate([],1,20).start,0);assert.equal(tools.paginate([],1,20).pages,1);
assert.equal(tools.paginate(rows,0,12).items.length,20);
assert.equal(tools.day('2026-10-30T16:00:00Z'),'2026-10-31');assert.equal(tools.day('bad'),'');
assert.equal(tools.dateBoundary('2026-10-31'),'2026-10-30T16:00:00.000Z');
assert.equal(tools.dateBoundary('2026-10-31',true),'2026-10-31T15:59:59.999Z');
assert.equal(tools.csvValue('=SUM(1)'), '"\'=SUM(1)"');assert.equal(tools.csvValue('a"b\nc'),'"a""b\nc"');
// Exercise the real export function: it must export every filtered row, not just the visible page.
const fs=require('fs'),vm=require('vm');let exported='';
const source=fs.readFileSync(require('path').join(__dirname,'../assets/js/admin.js'),'utf8');
const start=source.indexOf('function exportReports()'),end=source.indexOf('function exportHighIntentReports()',start);
const context={filteredReports:rows.map(x=>({...report,id:'report-'+x.id})),toCsvValue:tools.csvValue,
  formatDateTime:x=>x || '',getFollowupStatusLabel:()=> '新报告',setStatus:()=>{},Date,
  Blob:class{constructor(parts){exported=parts.join('');}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},
  document:{createElement:()=>({click:()=>{}}),body:{appendChild:()=>{},removeChild:()=>{}}}};
vm.runInNewContext(source.slice(start,end)+'\nexportReports();',context);
assert.equal(exported.trim().split('\n').length,46);assert(exported.includes('report-44'));assert(exported.includes('张同学'));assert(exported.includes('mnHELLO'));
console.log('PASS: identity/all-major search, multi-term matching, page bounds, empty results, Shanghai midnight boundaries and safe CSV');
