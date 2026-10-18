const assert=require('assert/strict');
const {createAssessmentHarness}=require('./lib/assessment_harness');
const h=createAssessmentHarness();
const {run,sandbox,nodes}=h;
const storage=new Map();
const adapter={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
sandbox.localStorage=adapter;
run('authSession={username:"alice"};answers={};applyMode("full");currentPage=4;answers[activeQuestions[0].id]=activeQuestions[0].options[0].key;');
assert(run('saveDraft()'));
const originalOrder=run('JSON.stringify(questionOrder)');
const snapshot=JSON.parse(storage.get('student-major-assessment-v2:alice'));
const badId=snapshot.questionOrder[1];snapshot.answers[badId]='invalid-option';snapshot.answers.unknown='1';
storage.set('student-major-assessment-v2:alice',JSON.stringify(snapshot));
run('clearDraft(false);');assert(run('loadDraft()'));
assert.equal(run('JSON.stringify(questionOrder)'),originalOrder);
assert.equal(run('currentPage'),4);
assert.equal(run('Object.keys(answers).length'),1);
assert.equal(run('quizForm.classList.contains("hidden")'),false);
// Starting a resumed draft must not rerandomize the questions or drop calibration state.
nodes.get('student-grade').value='G11';nodes.get('international-curriculum-name').value='IB';nodes.get('international-score-text').value='Mathematics AA HL 6';
nodes.get('start-btn').listeners.click();assert.equal(run('JSON.stringify(questionOrder)'),originalOrder);
run('authSession={username:"bob"};clearDraft(false);');assert.equal(run('loadDraft()'),false);assert.equal(run('Object.keys(answers).length'),0);
assert(storage.has('student-major-assessment-v2:alice'));
const legacy={...snapshot};delete legacy.owner;
storage.set('student-major-assessment-v2',JSON.stringify(legacy));
assert.equal(run('loadDraft()'),false);
run('authSession={username:"student"};');assert(run('loadDraft()'));
assert(storage.has('student-major-assessment-v2'));
assert(run('saveDraft()'));assert(storage.has('student-major-assessment-v2:student'));
// Storage failure does not erase answers or break navigation.
sandbox.localStorage={...adapter,setItem:()=>{throw Error('quota');}};
const before=run('JSON.stringify(answers)');assert.equal(run('saveDraft()'),false);assert.equal(run('JSON.stringify(answers)'),before);
assert(nodes.get('save-status').textContent.includes('暂时无法保存'));
sandbox.localStorage=adapter;
storage.set('student-major-assessment-v2:student','{broken');assert.equal(run('loadDraft()'),false);
assert.equal(storage.get('student-major-assessment-v2:student'),'{broken');
// Identical answers produce one report ID, even if the submit handler is called twice.
run('authSession={username:"alice"};answers={};applyMode("full");calibrationAdded=true;followUpAdded=true;for(const q of activeQuestions)answers[q.id]=q.options[2]?.key||q.options[0].key;');
nodes.get('student-grade').value='G11';nodes.get('international-curriculum-name').value='IB';nodes.get('international-score-text').value='Mathematics AA HL 6';
const submit=()=>nodes.get('quiz-form').listeners.submit({preventDefault(){}});
submit();const first=JSON.parse(storage.get('majornavi_report_v2:alice'));assert(first.payload.id);
submit();assert.equal(JSON.parse(storage.get('majornavi_report_v2:alice')).payload.id,first.payload.id);
run('answers[activeQuestions[0].id]=activeQuestions[0].options[0].key;');submit();
assert.notEqual(JSON.parse(storage.get('majornavi_report_v2:alice')).payload.id,first.payload.id);
// Real network wrapper must abort rather than hang indefinitely.
(async()=>{
 const timeout=createAssessmentHarness({reportApiBase:'https://example.invalid',setTimeout:fn=>setTimeout(fn,5),fetch:async(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))))});
 await assert.rejects(timeout.run('syncReportRecord({id:"timeout-test"})'),/aborted/);
 const pending=[];
 const cloud=createAssessmentHarness({reportApiBase:'https://example.invalid',fetch:async()=>new Promise(resolve=>pending.push(resolve))});
 const disk=new Map();cloud.sandbox.localStorage={getItem:k=>disk.get(k)||null,setItem:(k,v)=>disk.set(k,v),removeItem:k=>disk.delete(k)};
 cloud.run('authSession={username:"alice"};');
 const old={payload:{id:'old'},synced:false},latest={payload:{id:'latest'},synced:false};
 cloud.sandbox.old=old;cloud.sandbox.latest=latest;
 disk.set('majornavi_report_v2:alice',JSON.stringify(old));
 const older=cloud.run('deliverCachedReport(old)');
 disk.set('majornavi_report_v2:alice',JSON.stringify(latest));
 const newer=cloud.run('deliverCachedReport(latest)');assert.equal(pending.length,2);
 pending[0]({ok:true,json:async()=>({ok:true})});await older;assert.equal(JSON.parse(disk.get('majornavi_report_v2:alice')).payload.id,'latest');
 pending[1]({ok:true,json:async()=>({ok:true})});await newer;assert(JSON.parse(disk.get('majornavi_report_v2:alice')).synced);
 // Cloud upload still works when the browser cannot write local reports.
 const memory={payload:{id:'memory'},synced:false};cloud.sandbox.memory=memory;disk.clear();
 cloud.sandbox.localStorage.setItem=()=>{throw Error('quota');};cloud.run('activeReportRecord=memory;');
 const upload=cloud.run('deliverCachedReport(memory)');pending[2]({ok:true,json:async()=>({ok:true})});await upload;assert(memory.synced);
 console.log('PASS: draft resume/account separation/legacy migration/invalid-answer cleanup/storage failure/idempotent submission/network timeout/latest-report race/memory-only upload');
})().catch(error=>{console.error(error);process.exitCode=1;});
