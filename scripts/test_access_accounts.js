const assert=require('assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process');
const createAccess=require('../backend/node-report-api/access');
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-access-'));let child;
 try {
  let clock=1000000;const file=path.join(dir,'unit-access.json'),service=createAccess({file,adminPassword:'unit-password',now:()=>clock});
  const [one]=service.create({name:'单元试测',count:1,days:1});
  assert(one.password.length>=16);assert(!fs.readFileSync(file,'utf8').includes(one.password));assert(!service.list()[0].password);
  const session=service.login(one.username,one.password);assert.equal(session.account.status,'in_progress');
  clock+=86400001;assert.throws(()=>service.session(session.token),/过期/);assert.throws(()=>service.login(one.username,one.password),/过期/);
  const reset=service.update(one.id,{action:'reset'});assert.throws(()=>service.login(one.username,one.password),/错误/);assert.throws(()=>service.session(session.token),/失效/);assert.equal(service.login(one.username,reset.password).account.generation,2);
  const retrySession=service.login(one.username,reset.password),rename=fs.renameSync;
  try {fs.renameSync=()=>{throw Error('disk failure');};assert.throws(()=>service.commit(retrySession.token,{id:'atomic-test',recommendations:[{name:'test'}]}),/disk failure/);} finally {fs.renameSync=rename;}
  assert.equal(service.session(retrySession.token).account.status,'in_progress');
  service.commit(retrySession.token,{id:'atomic-test',recommendations:[{name:'test'}]});clock+=7*86400000+1;
  assert.throws(()=>service.report(retrySession.token),/过期/);
  const port=22000+Math.floor(Math.random()*10000),base=`http://127.0.0.1:${port}`;
  child=cp.spawn(process.execPath,[path.join(__dirname,'../backend/node-report-api/server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:dir,ADMIN_LOGIN_PASSWORD:'test-admin-password',ADMIN_TOKEN:'old-public-token',INGEST_KEY:'public-ingest'},stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',()=>reject(Error('API exited')));});
  async function req(route,method='GET',body,token='',extra={}) {const response=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...extra},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
  assert.equal((await req('/api/admin/accounts')).status,403);
  assert.equal((await req('/api/reports','GET',null,'',{'x-admin-token':'old-public-token'})).status,403);
  const admin=(await req('/api/auth/login','POST',{username:'admin',password:'test-admin-password'})).data;assert.equal(admin.role,'admin');
  const accounts=await req('/api/admin/accounts','POST',{count:2,name:'试测学生',grade:'G11',days:30},admin.token);assert.equal(accounts.status,200);assert.equal(accounts.data.items.length,2);
  const [a,b]=accounts.data.items;
  const list=(await req('/api/admin/accounts','GET',null,admin.token)).data;assert(!JSON.stringify(list).includes('password'));assert(!JSON.stringify(list).includes('Hash'));
  const student=(await req('/api/auth/login','POST',{username:a.username,password:a.password})).data;
  const other=(await req('/api/auth/login','POST',{username:b.username,password:b.password})).data;
  assert.equal((await req('/api/admin/accounts','GET',null,student.token)).status,403);
  assert.equal((await req('/api/reports','POST',{id:'bypass',recommendations:[{name:'bad'}]},'',{'x-report-ingest-key':'public-ingest'})).status,401);
  const payload={id:'report-test-a',recommendations:[{name:'数学'}],recoveryView:{example:true}};
  const outcomes=await Promise.all([req('/api/reports','POST',payload,student.token),req('/api/reports','POST',{...payload,id:'report-test-b'},student.token)]);
  assert.equal(outcomes.filter(x=>x.status===200).length,1);assert.equal(outcomes.filter(x=>x.status===409).length,1);
  const report=(await req('/api/auth/my-report','GET',null,student.token)).data.item;assert(report.id);assert.equal(report.accessAccount.name,'试测学生');
  assert.equal((await req('/api/reports','POST',{...payload,id:report.id},student.token)).status,200);
  const done=(await req('/api/auth/login','POST',{username:a.username,password:a.password})).data;assert.equal(done.account.status,'completed');
  assert.equal((await req('/api/auth/my-report','GET',null,other.token)).status,404);
  assert.equal((await req('/api/reports','POST',{...payload,id:report.id},other.token)).status,409);
  assert.equal((await req('/api/reports','POST',{id:'forged',recordType:'assessment_feedback',reportId:report.id},other.token)).status,403);
  assert.equal((await req('/api/reports','POST',{id:report.id,recordType:'assessment_session',answered:1},other.token)).status,200);
  assert.equal((await req('/api/auth/my-report','GET',null,student.token)).data.item.recommendations[0].name,report.recommendations[0].name);
  await req('/api/reports/'+report.id,'PATCH',{adminNote:'保留备注',adminStatus:'contacted'},admin.token);
  await req('/api/reports','POST',{...payload,id:report.id},student.token);
  assert.equal((await req('/api/reports/'+report.id,'GET',null,admin.token)).data.item.adminMeta.note,'保留备注');
  await req('/api/admin/accounts/'+a.id,'PATCH',{action:'disable'},admin.token);assert.equal((await req('/api/auth/session','GET',null,student.token)).status,403);
  const renewed=(await req('/api/admin/accounts/'+a.id,'PATCH',{action:'reset'},admin.token)).data.item;
  assert.equal((await req('/api/auth/session','GET',null,student.token)).status,401);assert.equal((await req('/api/auth/login','POST',{username:a.username,password:a.password})).status,401);
  const fresh=(await req('/api/auth/login','POST',{username:a.username,password:renewed.password})).data;assert.equal(fresh.account.status,'in_progress');
  await req('/api/auth/logout','POST',{},fresh.token);assert.equal((await req('/api/auth/session','GET',null,fresh.token)).status,401);
  await req('/api/reports/'+report.id,'DELETE',null,admin.token);assert.equal((await req('/api/reports/'+report.id,'GET',null,admin.token)).status,404);
  assert.equal((await req('/api/admin/accounts','POST',{count:101},admin.token)).status,400);
  let last;for(let i=0;i<11;i++)last=await req('/api/auth/login','POST',{username:'wrong-user',password:'wrong'});assert.equal(last.status,429);
  const raw=fs.readFileSync(path.join(dir,'access-store.json'),'utf8');assert(!raw.includes(a.password));assert(!raw.includes(admin.token));assert(!raw.includes('test-admin-password'));
  console.log('PASS: credential hashing/admin auth/batch registration/expiry/resume/atomic one-use/concurrent submit/idempotency/ownership/feedback/reset/revoke/logout/deletion/rate limit');
 } finally {if(child)child.kill();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
