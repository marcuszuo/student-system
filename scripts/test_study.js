const assert = require('assert/strict'), vm = require('vm'), fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const source = fs.readFileSync(path.join(__dirname,'../assets/js/study.js'),'utf8');
function harness(options={}) {
  let now=100000, posts=[]; const disk=new Map(), events={}, docEvents={};
  class Clock extends Date { constructor(...args){ super(...(args.length?args:[now])); } static now(){return now;} }
  const document={hidden:false,addEventListener:(name,fn)=>docEvents[name]=fn};
  const window={REPORT_API_BASE_URL:options.base || 'https://example.invalid',REPORT_INGEST_KEY:'test',addEventListener:(name,fn)=>events[name]=fn};
  const sandbox={window,document,Date:Clock,Math,AbortController,setTimeout,clearTimeout,localStorage:{getItem:key=>disk.get(key),setItem:(key,value)=>{if(options.quota)throw Error('quota');disk.set(key,value);}},fetch:options.fetch || (async(url,req)=>{posts.push(JSON.parse(req.body));return {ok:true};})};
  vm.runInNewContext(source,sandbox);
  return {api:window.MajorNaviStudy,window,document,disk,events,docEvents,posts,advance:ms=>now+=ms};
}
const drain=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const h=harness(), a=h.api;
 a.observe({page:1,total:120,answered:0,grade:'G11',type:'international',modules:['G','G','H']});
 h.advance(12000);a.observe({page:2,total:120,answered:6,grade:'G11',modules:['K']});
 h.advance(8000);a.checkpoint();await drain();
 let x=a.snapshot();assert.equal(x.activeSeconds,20);assert.equal(x.pageSeconds['1'],12);assert.equal(x.moduleSeconds.G,8);assert.equal(x.moduleSeconds.K,8);
 h.document.hidden=true;h.docEvents.visibilitychange();h.advance(300000);h.document.hidden=false;h.docEvents.visibilitychange();h.advance(5000);
 assert.equal(a.snapshot().activeSeconds,25);
 a.pause();h.advance(100000);assert.equal(a.snapshot().activeSeconds,25);
 a.observe({page:3,total:120,answered:12,modules:['I']});h.advance(200000);a.checkpoint();assert.equal(a.snapshot().activeSeconds,85);
 a.complete('report-1');await drain();h.advance(10000);assert.equal(a.snapshot().activeSeconds,85);
 assert.equal(h.posts.at(-1).status,'completed');assert.equal(h.posts.at(-1).reportId,'report-1');
 assert.equal(await a.feedback('report-1','部分符合','题目理解','测试意见'),'sent');assert.equal(h.posts.at(-1).recordType,'assessment_feedback');
 assert(!JSON.stringify(h.posts).includes('answers'));assert.equal(await a.feedback('report-1','bad','',''),false);
 const offline=harness({fetch:async()=>{throw Error('offline');}});
 assert.equal(await offline.api.feedback('r','符合','',''),'pending');assert.equal(JSON.parse([...offline.disk.values()][0]).length,1);
 const quota=harness({quota:true,fetch:async()=>{throw Error('offline');}});assert.equal(await quota.api.feedback('r','符合','',''),'failed');
 const adminSource=fs.readFileSync(path.join(__dirname,'../assets/js/admin.js'),'utf8'),panel={innerHTML:''};
 const adminSandbox={document:{getElementById:()=>panel},Date};
 vm.runInNewContext(adminSource.slice(adminSource.indexOf('function escapeHtml('),adminSource.indexOf('function setStatus('))+adminSource.slice(adminSource.indexOf('function formatDateTime('),adminSource.indexOf('function summarizeProfile('))+adminSource.slice(adminSource.indexOf('function renderPilotObservations(')),adminSandbox);
 adminSandbox.items=[{recordType:'assessment_feedback',rating:'符合',text:'<img src=x onerror=alert(1)>',reportId:'r'}];
 vm.runInNewContext('renderPilotObservations(items)',adminSandbox);
 assert(panel.innerHTML.includes('&lt;img'));assert(!panel.innerHTML.includes('<img'));assert(panel.innerHTML.includes('1 条反馈'));
 // Replacing a snapshot while an upload is pending must not drop the newer snapshot.
 let release;const race=harness({fetch:()=>new Promise(resolve=>release=()=>resolve({ok:true}))});
 race.api.observe({page:1,total:10,answered:0});race.api.checkpoint();race.advance(1000);race.api.observe({page:2,total:10,answered:5});race.api.checkpoint();
 release();await drain();assert.equal(JSON.parse([...race.disk.values()][0])[0].lastPage,2);release();await drain();assert.equal(JSON.parse([...race.disk.values()][0]).length,0);
 // Exercise the existing API end to end, with isolated local test storage.
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-study-')),port=19000+Math.floor(Math.random()*10000);
 const child=cp.spawn(process.execPath,[path.join(__dirname,'../backend/node-report-api/server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:dir,ADMIN_TOKEN:'test-admin',INGEST_KEY:'test'},stdio:['ignore','pipe','pipe']});
 try {
  await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',()=>reject(Error('API exited')));});
  const live=harness({base:`http://127.0.0.1:${port}`,fetch:global.fetch});
  live.api.observe({page:1,total:120,answered:6,grade:'G11',modules:['G']});live.api.complete('local-test-report');await drain();await live.api.flush();
  // Wait for the serialized upload queue, then submit feedback.
  for(let i=0;i<40 && JSON.parse([...live.disk.values()][0]||'[]').length;i++) await new Promise(r=>setTimeout(r,25));
  assert.equal(await live.api.feedback('local-test-report','符合','专业推荐','本地验证'),'sent');
  const result=await fetch(`http://127.0.0.1:${port}/api/reports?limit=200`,{headers:{'x-admin-token':'test-admin'}}).then(r=>r.json());
  assert.equal(result.items.filter(x=>x.recordType==='assessment_session').length,1);assert.equal(result.items.find(x=>x.recordType==='assessment_session').status,'completed');assert.equal(result.items.find(x=>x.recordType==='assessment_feedback').reportId,'local-test-report');
 } finally {child.kill();fs.rmSync(dir,{recursive:true,force:true});}
 console.log('PASS: timing/hidden time/pause/idle cap/modules/completion/feedback/offline queue/quota/race/API persistence');
})().catch(error=>{console.error(error);process.exitCode=1;});
