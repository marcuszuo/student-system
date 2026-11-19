const assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process'),net=require('net');

function report(id,submittedAt,overrides={}){
  return {id,submittedAt,siteVersion:'history-test-v24',studentProfile:{type:'international',typeLabel:'国际学生',grade:'G11',curriculumSummary:'IB Diploma'},
    accessAccount:{id:'historical-'+id,name:'模拟学生 '+id,username:'mn_'+id},
    recommendations:[{name:'数学与应用数学',courses:'数学分析、概率',matchIndex:80},{name:'应用物理学',courses:'力学、光学',matchIndex:78},{name:'计算机科学与技术',courses:'编程与算法',matchIndex:76}],
    scoring:{studentScore:{'cognition.abstract':70},integratedMeasurements:[{kind:'domain',dim:'domain.math',count:2,value:1}]},
    adminMeta:{status:'new',note:''},...overrides};
}
function csvRows(text){
  const result=[],row=[];let cell='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){
      if(quoted && text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;
    }else if(ch===',' && !quoted){row.push(cell);cell='';}
    else if((ch==='\n' || ch==='\r') && !quoted){if(ch==='\r' && text[i+1]==='\n')i++;row.push(cell);result.push([...row]);row.length=0;cell='';}
    else cell+=ch;
  }
  if(cell || row.length){row.push(cell);result.push(row);}assert(!quoted,'CSV must not end inside a quoted field');return result;
}
async function freePort(){const socket=net.createServer();await new Promise((resolve,reject)=>{socket.once('error',reject);socket.listen(0,'127.0.0.1',resolve);});const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));return port;}

(async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-history-test-')),data=path.join(root,'data');fs.mkdirSync(data);
  let child;
  try{
    const historical=Array.from({length:245},(_,i)=>report('history-'+String(i).padStart(3,'0'),new Date(Date.parse('2026-11-10T12:00:00Z')-i*60000).toISOString(),{
      accessAccount:{id:'account-'+i,name:i===244?'历史学生甲':i===0?' =SUM(1)':'模拟学生'+i,username:'mn_archive'+i},
      studentProfile:{type:i%2?'public':'international',typeLabel:i%2?'公立学校学生':'国际学生',grade:i%3?'G11':'G10',curriculumSummary:i%2?'公立课程':'IB Diploma'},
      recommendations:[{name:i%2?'数学与应用数学':'应用物理学',courses:'理科课程',matchIndex:60+i/10},{name:'计算机科学与技术',courses:'编程与算法',matchIndex:58}],
      adminMeta:{status:i%5===0?'high_intent':i%5===1?'pending':'new',note:i===0?'含逗号,引号"和换行\n第二行':'历史跟进 '+i}
    }));
    const edges=[['edge-before','2026-11-18T15:59:59.999Z'],['edge-start','2026-11-18T16:00:00.000Z'],['edge-end','2026-11-19T15:59:59.999Z'],['edge-after','2026-11-19T16:00:00.000Z']].map(([id,time])=>report(id,time,{recommendations:[{name:'生物科学',courses:'生命科学',matchIndex:1}]}));
    const seeded=[...historical,...edges],observations=Array.from({length:45},(_,i)=>({id:'observation-'+i,recordType:i%2?'assessment_feedback':'assessment_session',submittedAt:'2026-11-20T12:00:00Z',reportId:'history-001'}));
    fs.writeFileSync(path.join(data,'reports.json'),JSON.stringify([...seeded,...observations]));
    const port=await freePort(),base='http://127.0.0.1:'+port;
    child=cp.spawn(process.execPath,[path.join(__dirname,'../backend/node-report-api/server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:data,BACKUP_DIR:path.join(root,'backups'),ADMIN_LOGIN_PASSWORD:'history-local-only-admin'},stdio:['ignore','pipe','pipe']});
    await new Promise((resolve,reject)=>{
      let output='';const timer=setTimeout(()=>reject(Error('API startup timed out: '+output)),8000);
      child.stdout.on('data',chunk=>{output+=chunk;if(output.includes('listening on')){clearTimeout(timer);resolve();}});
      child.stderr.on('data',chunk=>{output+=chunk;});child.once('error',error=>{clearTimeout(timer);reject(error);});child.once('exit',code=>{clearTimeout(timer);reject(Error('API exited '+code+': '+output));});
    });
    async function request(route,{method='GET',body,token,headers={}}={}){
      const response=await fetch(base+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{}),...headers},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(8000)});
      const text=await response.text();return {status:response.status,text,data:response.headers.get('content-type')?.includes('application/json')?JSON.parse(text):null,headers:response.headers};
    }
    const capability=await request('/api/auth/capabilities');assert(capability.data.historyPagination);assert(capability.data.frozenReports);assert(capability.data.scheduledBackups);
    assert.equal((await request('/api/reports?paged=1')).status,403);assert.equal((await request('/api/reports?paged=1&export=csv')).status,403);
    const login=await request('/api/auth/login',{method:'POST',body:{username:'admin',password:'history-local-only-admin'}});assert.equal(login.status,200);const admin=login.data.token;
    const get=route=>request(route,{token:admin});
    const first=await get('/api/reports?paged=1&page_size=20&include_observations=1');
    assert.equal(first.status,200);assert.equal(first.data.pagination.total,249);assert.equal(first.data.pagination.pages,13);assert.equal(first.data.items.length,20);assert.equal(first.data.items[0].id,'edge-after');
    assert.equal(first.data.observations.length,45);assert(first.data.items.every(x=>!x.recordType));assert.equal(first.data.overview.total,249);
    assert.equal(first.data.overview.public,122);assert.equal(first.data.overview.international,127);assert.equal(first.data.overview.highIntent,49);
    const pages=await Promise.all(Array.from({length:13},(_,i)=>get('/api/reports?paged=1&page_size=20&page='+(i+1))));
    const ids=pages.flatMap(x=>x.data.items.map(item=>item.id));assert.equal(ids.length,249);assert.equal(new Set(ids).size,249);assert(ids.includes('history-244'));
    assert.equal(pages.at(-1).data.items.length,9);assert.equal(pages.at(-1).data.pagination.end,249);
    const huge=await get('/api/reports?paged=1&page_size=99999&page=99999');assert.equal(huge.data.pagination.pageSize,200);assert.equal(huge.data.pagination.page,2);assert.equal(huge.data.items.length,49);
    const invalid=await get('/api/reports?paged=1&page=-2&page_size=NaN');assert.equal(invalid.data.pagination.page,1);assert.equal(invalid.data.pagination.pageSize,20);
    const q=encodeURIComponent('历史学生甲 mn_archive244 计算机');
    const search=await get('/api/reports?paged=1&q='+q);assert.deepEqual(search.data.items.map(x=>x.id),['history-244']);assert.equal(search.data.pagination.total,1);
    assert.deepEqual((await get('/api/reports?paged=1&q=history-244')).data.items.map(x=>x.id),['history-244']);
    const absent=await get('/api/reports?paged=1&q=不存在的学生');assert.equal(absent.data.pagination.total,0);assert.deepEqual(absent.data.items,[]);assert.equal(absent.data.pagination.start,0);
    const filtered=await get('/api/reports?paged=1&type=international&grade=G11&status=high_intent&page_size=200');
    const expected=historical.filter((_,i)=>i%2===0 && i%3!==0 && i%5===0);assert.deepEqual(new Set(filtered.data.items.map(x=>x.id)),new Set(expected.map(x=>x.id)));assert.equal(filtered.data.overview.highIntent,expected.length);
    const day=await get('/api/reports?paged=1&date_from=2026-11-19&date_to=2026-11-19');assert.deepEqual(new Set(day.data.items.map(x=>x.id)),new Set(['edge-start','edge-end']));
    const utc=await get('/api/reports?paged=1&date_from=2026-11-18T16%3A00%3A00.000Z&date_to=2026-11-19T15%3A59%3A59.999Z');assert.deepEqual(new Set(utc.data.items.map(x=>x.id)),new Set(['edge-start','edge-end']));
    assert.equal((await get('/api/reports?paged=1&date_from=bad')).status,400);assert.equal((await get('/api/reports?paged=1&date_from=2026-11-20&date_to=2026-11-19')).status,400);
    assert.equal((await get('/api/reports?paged=1&sort=submitted_asc')).data.items[0].id,'history-244');assert.equal((await get('/api/reports?paged=1&sort=match_desc')).data.items[0].id,'history-244');
    const csv=await get('/api/reports?paged=1&page_size=10&page=2&export=csv');assert(csv.headers.get('content-type').includes('text/csv'));
    const parsed=csvRows(csv.text);assert.equal(parsed.length,250);assert(parsed.slice(1).some(row=>row[0]==='history-244'));assert(!csv.text.includes('observation-'));
    assert.equal(parsed.find(row=>row[0]==='history-000')[1],"' =SUM(1)");assert.equal(parsed.find(row=>row[0]==='history-000')[9],'含逗号,引号"和换行\n第二行');
    const selectedCsv=csvRows((await get('/api/reports?paged=1&q='+q+'&export=csv')).text);assert.equal(selectedCsv.length,2);assert.equal(selectedCsv[1][0],'history-244');
    assert.equal(csvRows((await get('/api/reports?paged=1&export=csv&high_intent=1')).text).length,50);
    const account=(await request('/api/admin/accounts',{method:'POST',token:admin,body:{name:'服务端登记学生',grade:'G11',count:1,days:30}})).data.items[0];
    const student=(await request('/api/auth/login',{method:'POST',body:{username:account.username,password:account.password}})).data;
    assert.equal((await request('/api/reports?paged=1',{token:student.token})).status,403);assert.equal((await request('/api/reports?paged=1&export=csv',{token:student.token})).status,403);
    const forgedSnapshot={version:1,content:{profile:'伪造资料',conclusion:'客户端伪造结论',explanation:'伪造说明',portrait:[],recommendations:[{name:'伪造专业',role:'优先推荐',rationale:'伪造依据',focus:'伪造重点',task:'伪造任务',study:'伪造课程'}]}};
    assert(require('../assets/js/report-pdf').isFrozen(forgedSnapshot),'The forged snapshot must pass structural validation to test forced server capture');
    const payload=report('new-student-report','2000-01-01T00:00:00Z',{accessAccount:{name:'伪造姓名'},frozenReport:forgedSnapshot});
    const submitted=await request('/api/reports',{method:'POST',token:student.token,body:payload});assert.equal(submitted.status,200);
    const saved=(await get('/api/reports/new-student-report')).data.item;assert.equal(saved.accessAccount.name,'服务端登记学生');assert.equal(saved.frozenReport.origin,'at-submission');assert.equal(saved.frozenReport.version,1);assert(!saved.frozenReport.content.conclusion.includes('伪造'));
    const fixed=JSON.stringify(saved.frozenReport);
    const retry=await request('/api/reports',{method:'POST',token:student.token,body:{...payload,recommendations:[{name:'更改后的专业',courses:'不同课程'}]}});assert.equal(retry.status,200);
    assert.equal(JSON.stringify((await get('/api/reports/new-student-report')).data.item.frozenReport),fixed);
    assert.equal(JSON.stringify((await request('/api/auth/my-report',{token:student.token})).data.item.frozenReport),fixed);
    const noted=await request('/api/reports/new-student-report',{method:'PATCH',token:admin,body:{adminNote:'新备注',adminStatus:'high_intent'}});assert.equal(noted.status,200);assert.equal(JSON.stringify(noted.data.item.frozenReport),fixed);
    // Legacy clients keep their existing endpoint contract while new clients can search all history.
    const legacy=await get('/api/reports?limit=999');assert.equal(legacy.data.items.length,200);assert.equal(legacy.data.pagination,undefined);
    console.log('PASS: 249 reports plus observations, all-history search/pagination/filters/Shanghai dates, full CSV with escaping, auth denial, trusted frozen submission and idempotent retry');
  }finally{
    if(child && child.exitCode===null){const closed=new Promise(resolve=>child.once('close',resolve));child.kill();await closed;}
    fs.rmSync(root,{recursive:true,force:true});
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
