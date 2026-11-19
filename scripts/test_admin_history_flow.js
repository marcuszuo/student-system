const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const source=name=>fs.readFileSync(path.join(__dirname,'../assets/js',name),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function record(index,prefix='history'){
  return {id:`${prefix}-${String(index).padStart(3,'0')}`,submittedAt:new Date(Date.parse('2026-11-19T04:00:00Z')-index*60000).toISOString(),
    accessAccount:{name:'学生'+index,username:'mn_student'+index},studentProfile:{type:'international',typeLabel:'国际学生',grade:'G11',curriculumSummary:'IB Diploma'},
    recommendations:[{name:'数学与应用数学',courses:'数学分析',matchIndex:80}],adminMeta:{status:'new'}};
}
function pageResponse(items,{page=1,size=20,total=items.length}={}){
  const pages=Math.max(1,Math.ceil(total/size));page=Math.min(Math.max(1,page),pages);
  return {items,pagination:{page,pages,total,pageSize:size,start:total?(page-1)*size+1:0,end:Math.min(page*size,total)},
    overview:{total,today:0,public:0,international:total,highIntent:3},observations:[]};
}
function harness({supported=true}={}){
  const nodes=new Map(),calls=[],downloads=[],errors=[],timers=new Map(),pending=[];
  let token=null,timerId=0,defer=false;
  const records=Array.from({length:245},(_,i)=>record(i));
  const legacy=Array.from({length:45},(_,i)=>record(i,'legacy'));
  class Element{
    constructor(id){this.id=id;this.value=id==='admin-page-size'?'20':'';this.textContent='';this.innerHTML='';this.dataset={};this.listeners={};this.disabled=false;this.open=false;
      const classes=new Set();this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)};}
    addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
    appendChild(){} removeChild(){} remove(){} scrollIntoView(){} setAttribute(){}
    querySelector(){return null;}querySelectorAll(){return [];}
    showModal(){this.open=true;}
    close(){this.open=false;for(const fn of this.listeners.close || [])fn({target:this});}
    click(){downloads.push({name:this.download,href:this.href});}
  }
  const node=id=>{if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);};
  const document={body:Object.assign(node('body'),{dataset:{adminView:'assessment'}}),getElementById:node,querySelector:()=>node('main'),querySelectorAll:()=>[],createElement:tag=>new Element('created-'+tag)};
  class MockURL extends URL{}
  MockURL.createObjectURL=()=> 'blob:local-test';MockURL.revokeObjectURL=()=>{};
  const response=data=>({ok:true,status:200,json:async()=>data,blob:async()=>new Blob(['test export'],{type:'text/csv'})});
  const fetch=async(url,options={})=>{
    const entry={url:String(url),options};calls.push(entry);const parsed=new URL(url);
    if(parsed.pathname.endsWith('/capabilities'))return response({historyPagination:supported});
    if(parsed.pathname==='/api/reports' && parsed.searchParams.get('export')==='csv')return response({});
    if(parsed.pathname==='/api/reports' && parsed.searchParams.get('paged')==='1'){
      if(defer)return new Promise((resolve,reject)=>pending.push({entry,resolve:data=>resolve(response(data)),reject}));
      const query=parsed.searchParams.get('q'),page=Number(parsed.searchParams.get('page') || 1),size=Number(parsed.searchParams.get('page_size') || 20);
      const selected=query && query.includes('student244')?[records[244]]:records;
      return response(pageResponse(selected.slice((page-1)*size,page*size),{page,size,total:selected.length}));
    }
    if(parsed.pathname==='/api/reports')return response({items:[...legacy,{id:'observed-session',recordType:'assessment_session',submittedAt:'2026-11-19T03:00:00Z'}]});
    throw Error('Unexpected request: '+url);
  };
  const context={window:{ADMIN_DEFAULT_API_BASE:'https://api.example.test',MajorNaviAccess:{admin:()=>token?{token}:null},location:{search:''}},document,
    HTMLElement:Element,HTMLTextAreaElement:Element,HTMLSelectElement:Element,URL:MockURL,URLSearchParams,AbortController,Blob,Date,
    fetch,console:{log:()=>{},error:error=>errors.push(error)},setTimeout:(fn,delay)=>{const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout:id=>timers.delete(id)};
  vm.createContext(context);for(const name of ['report-list-tools.js','admin-history.js','admin.js'])vm.runInContext(source(name),context,{filename:name});
  const run=code=>vm.runInContext(code,context),dispatch=async(id,type)=>{for(const fn of node(id).listeners[type] || [])await fn({target:node(id)});await tick();};
  const flushDebounce=async()=>{const tasks=[...timers.entries()].filter(([,task])=>task.delay<=200);for(const [id,task] of tasks){timers.delete(id);task.fn();}await tick();};
  const pageCalls=()=>calls.filter(x=>new URL(x.url).searchParams.get('paged')==='1' && !new URL(x.url).searchParams.has('export'));
  return {nodes,node,calls,downloads,errors,pending,run,dispatch,flushDebounce,pageCalls,timers,enable:()=>{token='synthetic-admin-token';},defer:()=>{defer=true;}};
}

async function main(){
  const h=harness();await tick();assert.equal(h.calls.length,0,'Admin boot without a token must not fetch protected data');
  h.enable();await h.run('fetchReports()');
  assert.equal(h.run('historyEnabled'),true);assert.equal(h.run('reports.length'),20);assert.equal(h.run('filteredReports.length'),20);
  assert.equal(h.node('admin-count').textContent,'245 份');assert.equal(Number(h.node('admin-total-count').textContent),245);
  assert.equal(h.node('admin-page-status').textContent,'第 1 / 13 页 · 显示 1—20 / 245 份');assert(h.node('admin-page-prev').disabled);assert(!h.node('admin-page-next').disabled);
  assert(h.node('admin-load-scope').textContent.includes('全部历史报告'));
  assert.equal(h.pageCalls()[0].options.headers['x-admin-token'],'synthetic-admin-token');
  await h.dispatch('admin-page-next','click');assert.equal(h.pageCalls().length,1,'Page change waits for the refresh debounce');
  await h.flushDebounce();assert.equal(h.run('reportPage'),2);assert.equal(h.run('filteredReports[0].id'),'history-020');
  assert.equal(new URL(h.pageCalls().at(-1).url).searchParams.get('page'),'2');assert.equal(h.node('admin-page-status').textContent,'第 2 / 13 页 · 显示 21—40 / 245 份');
  h.node('admin-page-size').value='50';await h.dispatch('admin-page-size','change');await h.flushDebounce();
  assert.equal(h.run('reportPage'),1);assert.equal(h.run('filteredReports.length'),50);assert.equal(h.node('admin-page-status').textContent,'第 1 / 5 页 · 显示 1—50 / 245 份');
  assert.equal(new URL(h.pageCalls().at(-1).url).searchParams.get('page_size'),'50');
  const before=h.pageCalls().length;
  h.node('admin-search-filter').value='student2';await h.dispatch('admin-search-filter','input');
  h.node('admin-search-filter').value='student24';await h.dispatch('admin-search-filter','input');
  h.node('admin-search-filter').value='student244';await h.dispatch('admin-search-filter','input');
  assert.equal(h.pageCalls().length,before);assert.equal([...h.timers.values()].filter(x=>x.delay===200).length,1);
  await h.flushDebounce();assert.equal(h.pageCalls().length,before+1);assert.equal(h.run('filteredReports[0].id'),'history-244');
  assert.equal(h.node('admin-count').textContent,'1 份');assert(h.node('admin-report-list').innerHTML.includes('history-244'));
  // CSV must use all current filter controls, not rows cached on the visible page.
  h.node('admin-grade-filter').value='G11';h.node('admin-followup-filter').value='contacted';h.node('admin-type-filter').value='international';h.node('admin-sort-filter').value='major_asc';
  h.node('admin-date-from').value='2026-11-01';h.node('admin-date-to').value='2026-11-19';
  await h.run('exportReports()');const csvCall=h.calls.findLast(x=>new URL(x.url).searchParams.get('export')==='csv'),csvQuery=new URL(csvCall.url).searchParams;
  assert.equal(csvQuery.get('q'),'student244');assert.equal(csvQuery.get('grade'),'G11');assert.equal(csvQuery.get('status'),'contacted');assert.equal(csvQuery.get('type'),'international');assert.equal(csvQuery.get('sort'),'major_asc');
  assert.equal(csvQuery.get('date_from'),'2026-10-31T16:00:00.000Z');assert.equal(csvQuery.get('date_to'),'2026-11-19T15:59:59.999Z');assert.equal(csvQuery.get('page_size'),'50');
  assert.equal(csvCall.options.headers['x-admin-token'],'synthetic-admin-token');assert.equal(h.downloads.length,1);assert(h.downloads[0].name.endsWith('.csv'));assert.equal(h.node('admin-export-btn').disabled,false);
  await h.run('exportHighIntentReports()');assert.equal(new URL(h.calls.at(-1).url).searchParams.get('high_intent'),'1');assert.equal(h.downloads.length,2);
  // Ignore a completed older request even if the transport does not honor abort.
  h.defer();h.node('admin-search-filter').value='old-request';const older=h.run('fetchReports()');await tick();assert.equal(h.pending.length,1);
  h.node('admin-search-filter').value='new-request';await h.dispatch('admin-search-filter','input');assert(h.pending[0].entry.options.signal.aborted);
  await h.flushDebounce();assert.equal(h.pending.length,2);
  h.pending[1].resolve(pageResponse([record(2,'new-result')],{total:1,size:50}));await tick();assert.equal(h.run('filteredReports[0].id'),'new-result-002');
  h.pending[0].resolve(pageResponse([record(1,'stale-result')],{total:1,size:50}));await older;await tick();
  assert.equal(h.run('filteredReports[0].id'),'new-result-002');assert(!h.node('admin-report-list').innerHTML.includes('stale-result'));assert.equal(h.errors.length,0);
  h.node('admin-search-filter').value='old-failing-request';await h.dispatch('admin-search-filter','input');await h.flushDebounce();
  h.node('admin-search-filter').value='current-success';await h.dispatch('admin-search-filter','input');await h.flushDebounce();assert.equal(h.pending.length,4);
  h.pending[3].resolve(pageResponse([record(3,'current-result')],{total:1,size:50}));await tick();const currentStatus=h.node('admin-status').textContent;
  h.pending[2].reject(Error('stale transport failed'));await tick();
  assert.equal(h.run('filteredReports[0].id'),'current-result-003');assert.equal(h.node('admin-status').textContent,currentStatus,'An older failed request must not overwrite the latest successful status');
  h.node('admin-search-filter').value='latest-failing-request';await h.dispatch('admin-search-filter','input');await h.flushDebounce();
  h.pending[4].reject(Error('current transport failed'));await tick();assert.equal(h.node('admin-status').textContent,'current transport failed','A current request error must remain visible');
  const old=harness({supported:false});await tick();assert.equal(old.calls.length,0);old.enable();await old.run('fetchReports()');
  assert.equal(old.run('historyEnabled'),false);assert.equal(old.run('remoteState'),null);assert.equal(old.run('reports.length'),45);assert.equal(old.run('filteredReports.length'),45);assert.equal(old.node('admin-count').textContent,'45 份');
  assert.equal(old.node('admin-page-status').textContent,'第 1 / 3 页 · 显示 1—20 / 45 份');
  assert(old.node('admin-load-scope').textContent.includes('本次已加载报告'));assert(old.calls.some(x=>new URL(x.url).searchParams.get('limit')==='200'));assert.equal(old.pageCalls().length,0);
  const oldCount=old.calls.length;await old.dispatch('admin-page-next','click');assert.equal(old.node('admin-page-status').textContent,'第 2 / 3 页 · 显示 21—40 / 45 份');assert.equal(old.calls.length,oldCount);
  old.node('admin-search-filter').value='legacy-044';await old.dispatch('admin-search-filter','input');assert.equal(old.run('filteredReports.length'),1);assert.equal(old.run('filteredReports[0].id'),'legacy-044');assert.equal(old.calls.length,oldCount);
  await old.dispatch('admin-reset-filters-btn','click');assert.equal(old.run('reportPage'),1);assert.equal(old.run('filteredReports.length'),45);assert.equal(old.errors.length,0);
  console.log('PASS: actual admin.js server totals/current-page rendering, pagination/page size fetches, query debounce, latest-response race guard, filter-consistent CSV and unchanged legacy fallback');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
