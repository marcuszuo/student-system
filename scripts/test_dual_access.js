const assert=require('assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process');
const createAccess=require('../backend/node-report-api/access');
const DAY=86400000;
(async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-dual-'));let child;
 try {
  let clock=Date.now();const file=path.join(dir,'unit.json'),service=createAccess({file,adminPassword:'test-admin',now:()=>clock});
  const [onlyAssessment]=service.create({permissions:{assessment:true,gaokao:false},days:30});
  const [onlyQuery]=service.create({permissions:{assessment:false,gaokao:true},days:1,gaokaoDays:20});
  const [both]=service.create({permissions:{assessment:true,gaokao:true},days:1,gaokaoDays:30});
  const a=service.login(onlyAssessment.username,onlyAssessment.password),g=service.login(onlyQuery.username,onlyQuery.password),b=service.login(both.username,both.password);
  assert.throws(()=>service.gaokaoPermit(a.token),/未开通/);
  assert.throws(()=>service.commit(g.token,{id:'no-assessment',recommendations:[{}]}),/未开通/);
  assert.throws(()=>service.record(g.token,{recordType:'assessment_session'}),/没有可用/);
  assert.throws(()=>service.record(a.token,{recordType:'assessment_feedback',reportId:null}),/只能反馈/);
  const first=service.queryRecord(g.token,{id:'q1',accessAccount:{id:'forged',name:'fake'}});
  assert.equal(first.accessAccount.id,onlyQuery.id);assert.notEqual(first.accessAccount.name,'fake');
  service.noteQuery(g.token,first.id);service.noteQuery(g.token,first.id);
  assert.equal(service.session(g.token).account.features.gaokao.queryCount,1);
  const other=service.queryRecord(b.token,{id:'q1'});assert.notEqual(first.id,other.id);
  const saved=service.commit(b.token,{id:'report-both',recommendations:[{name:'数学'}]});
  assert.equal(saved.accessAccount.id,both.id);assert(service.session(b.token).account.features.gaokao.canQuery);
  assert.equal(service.session(b.token).account.features.assessment.canStart,false);
  assert.throws(()=>service.commit(b.token,{id:'second',recommendations:[{}]}),/已完成/);
  service.queryRecord(b.token,{id:'after-report'});
  clock+=8*DAY;
  assert(service.session(b.token).account.features.gaokao.canQuery);assert.equal(service.session(b.token).account.features.assessment.canViewReport,false);
  assert.throws(()=>service.report(b.token),/查看期/);assert(service.login(both.username,both.password).account.features.gaokao.canQuery);
  assert(service.session(g.token).account.features.gaokao.canQuery); // assessment expiry is irrelevant to query-only accounts
  const expiry=service.session(b.token).account.features.gaokao.expiresAt;
  const reset=service.update(both.id,{action:'reset'});assert.equal(reset.features.gaokao.expiresAt,expiry);
  assert.throws(()=>service.session(b.token),/失效/);const renewed=service.login(both.username,reset.password);assert(renewed.account.features.assessment.canStart);
  service.update(both.id,{action:'edit',permissions:{assessment:true,gaokao:false}});
  assert.throws(()=>service.gaokaoPermit(renewed.token),/未开通/);
  service.update(both.id,{action:'edit',permissions:{assessment:true,gaokao:true}});assert(service.gaokaoPermit(renewed.token));
  assert.throws(()=>service.update(both.id,{action:'edit',permissions:{assessment:false,gaokao:false}}),/至少一项/);
  assert.throws(()=>service.update(both.id,{action:'edit',gaokaoDays:0}),/有效期/);
  service.update(both.id,{action:'disable'});assert.throws(()=>service.gaokaoPermit(renewed.token),/停用/);
  clock+=22*DAY;assert.throws(()=>service.login(onlyQuery.username,onlyQuery.password),/过期/);
  // Old access-store files retain assessment-only grants; no automatic expansion.
  const ledger=JSON.parse(fs.readFileSync(file));const legacy=ledger.accounts.find(x=>x.id===onlyAssessment.id);delete legacy.permissions;delete legacy.gaokaoExpiresAt;fs.writeFileSync(file,JSON.stringify(ledger));
  assert.equal(service.list().find(x=>x.id===onlyAssessment.id).permissions.gaokao,false);
  const port=24000+Math.floor(Math.random()*12000),base=`http://127.0.0.1:${port}`;
  child=cp.spawn(process.execPath,[path.join(__dirname,'../backend/node-report-api/server.js')],{env:{...process.env,PORT:String(port),DATA_DIR:dir,ADMIN_LOGIN_PASSWORD:'local-only-admin',INGEST_KEY:'public-ingest'},stdio:['ignore','pipe','pipe']});
  await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',()=>reject(Error('API exited')));});
  async function req(route,method='GET',body,token='',headers={}) {const response=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...headers},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
  assert.equal((await req('/api/auth/capabilities')).data.dualAccess,true);
  const admin=(await req('/api/auth/login','POST',{username:'admin',password:'local-only-admin'})).data;
  const account=(await req('/api/admin/accounts','POST',{name:'查询用户',permissions:{assessment:false,gaokao:true},days:1,gaokaoDays:30},admin.token)).data.items[0];
  const queryLogin=(await req('/api/auth/login','POST',{username:account.username,password:account.password})).data;
  assert.equal((await req('/api/auth/gaokao-permit','GET',null,queryLogin.token)).status,200);
  assert.equal((await req('/api/gaokao-queries','POST',{id:'unauth'},'',{'x-report-ingest-key':'public-ingest'})).status,401);
  for(const id of ['q1','q1','q2']) assert.equal((await req('/api/gaokao-queries','POST',{id,province:'广东',accessAccount:{id:'fake'}},queryLogin.token)).status,200);
  assert.equal((await req('/api/auth/session','GET',null,queryLogin.token)).data.account.features.gaokao.queryCount,2);
  const records=(await req('/api/gaokao-queries?account_id='+account.id,'GET',null,admin.token)).data.items;
  assert.equal(records.length,2);assert(records.every(x=>x.accessAccount.id===account.id && x.accessAccount.name==='查询用户'));
  assert.equal((await req('/api/gaokao-queries?account_id=other','GET',null,admin.token)).data.items.length,0);
  assert.equal((await req('/api/reports','POST',{id:'query-cannot-submit',recommendations:[{}]},queryLogin.token)).status,403);
  const assessment=(await req('/api/admin/accounts','POST',{permissions:{assessment:true,gaokao:false}},admin.token)).data.items[0];
  const login=(await req('/api/auth/login','POST',{username:assessment.username,password:assessment.password})).data;
  assert.equal((await req('/api/gaokao-queries','POST',{id:'denied'},login.token)).status,403);
  console.log('PASS: separate permissions/expiry/completion/report window/reset/legacy migration/revocation/query idempotency/ownership/admin history/public-key rejection');
 } finally {if(child)child.kill();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
