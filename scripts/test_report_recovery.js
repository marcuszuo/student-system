const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const source = fs.readFileSync(require('path').join(__dirname, '../assets/js/app.js'), 'utf8');
const nodes = new Map();
const storage = new Map();
const element = () => ({ textContent: '', children: [], setAttribute() {}, append(...items) { this.children.push(...items); }, addEventListener() {} });
let calls = 0, fail = true;
const sandbox = {
  getIntegratedMeasurements:()=>[], console, authSession: {username:'student'}, REPORT_API_BASE_URL: 'test',
  localStorage: {getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v)},
  document: {getElementById: id => nodes.get(id), createElement: element, querySelector: () => null},
  resultBox: { prepend(node) {nodes.set(node.id,node);}, classList: {remove(){}} },
  activeQuestions: [{id:'Q1',text:'<题目>',options:[{key:'A',dim:'interest.i',text:'研究'},{key:'B',dim:'interest.a',text:'创作'}]}, {id:'Q2',text:'另一题',options:[{key:'A',dim:'interest.i',text:'研究'},{key:'B',dim:'interest.a',text:'创作'}]}],
  allQuestions: [], answers: {Q1:'A',Q2:'B'}, getMajorCoreDims: () => ['interest.i','ability.math'], dimensionNameMap: {},
  studentProfile:{type:'public'},selectedMode:'full',publicSubjectScores:{},internationalProfile:{},schoolMajorText:'',calibrationContext:null,calibrationAdded:false,followUpAdded:false,
  setSaveStatus: () => {}, renderResult: () => {calls++;},
  syncReportRecord: async payload => {calls++; assert.equal(payload.id,'stable-id'); if(fail) throw Error('offline'); return {ok:true};}
};
vm.createContext(sandbox);
vm.runInContext(source.slice(source.indexOf('const REPORT_CACHE_PREFIX'), source.indexOf('function buildEvidence(')), sandbox);
(async () => {
  assert(vm.runInContext('hasJointPriority([{score01:1},{score01:.97}])',sandbox));
  assert(!vm.runInContext('hasJointPriority([{score01:1},{score01:.96}])',sandbox));
  assert(!vm.runInContext('hasJointPriority([{score01:1}])',sandbox));
  const evidence = vm.runInContext('buildAnswerEvidence({})',sandbox);
  assert.equal(evidence.supporting[0].questionId,'Q1');
  assert.equal(evidence.toVerify[0].questionId,'Q2');
  assert(evidence.missing.includes('ability.math'));
  assert(vm.runInContext('renderAnswerEvidence({name:"测试",courses:"课程"})',sandbox).includes('&lt;题目&gt;'));
  const record = {payload:{id:'stable-id'},synced:false,view:{answers:{},questionIds:[],studentVector:{},rankedMajors:[]}};
  sandbox.record = record;
  storage.set('majornavi_report_v2:student',JSON.stringify(record));
  await vm.runInContext('Promise.all([deliverCachedReport(record),deliverCachedReport(record)])',sandbox);
  assert.equal(calls,1); assert.equal(record.synced,false); assert(storage.size);
  fail=false;
  await vm.runInContext('deliverCachedReport(record)',sandbox);
  assert.equal(calls,2); assert(JSON.parse(storage.get('majornavi_report_v2:student')).synced);
  await vm.runInContext('deliverCachedReport(record)',sandbox); assert.equal(calls,2);
  vm.runInContext('restoreSavedReport()',sandbox); assert.equal(calls,3);
  sandbox.authSession={username:'other'};
  vm.runInContext('restoreSavedReport()',sandbox); assert.equal(calls,3);
  console.log('PASS: close rankings, answer evidence, escaping, failure/retry, duplicate guard, restore and account isolation');
})().catch(error => {console.error(error); process.exitCode=1;});
