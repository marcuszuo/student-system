const assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const storage=require('../backend/node-report-api/storage');
const renderer=require('../assets/js/report-pdf'),parent=require('../assets/js/parent-report');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-storage-recovery-'));
function layout(name){const data=path.join(dir,name);fs.mkdirSync(data,{recursive:true});return {data,files:{reports:path.join(data,'reports.json'),accounts:path.join(data,'access-store.json'),queries:path.join(data,'gaokao_queries.json')},backups:path.join(dir,name+'-backups')};}
function seed(files){
  storage.writeJson(files.reports,[{id:'report-original',submittedAt:'2026-11-19T01:00:00Z'}],Array.isArray);
  storage.writeJson(files.accounts,{accounts:[{id:'student-one',generation:2}],sessions:[{hash:'previous-session-hash',role:'admin'}],submissions:[{id:'report-original'}]});
  storage.writeJson(files.queries,[{id:'query-original',accessAccount:{id:'student-one'}}],Array.isArray);
}
function contents(files){return Object.fromEntries(Object.entries(files).map(([key,file])=>[key,fs.readFileSync(file,'utf8')]));}
function call(script,env,args=[],code){
  const file=path.resolve(__dirname,'../backend/node-report-api',script);
  return cp.spawnSync(process.execPath,code?['-e',code,file,...args]:[file,...args],{encoding:'utf8',env:{...process.env,DATA_DIR:env.data,DATA_FILE:env.files.reports,GAOKAO_QUERY_FILE:env.files.queries,BACKUP_DIR:env.backups}});
}
try{
  const live=layout('live');seed(live.files);
  const before=contents(live.files);
  storage.writeJson(live.files.reports,[{id:'report-new'}],Array.isArray);
  assert.equal(fs.readFileSync(path.join(live.data,'.last-good','reports.json'),'utf8'),before.reports);
  assert.equal(fs.statSync(live.files.reports).mode&0o777,0o600);
  assert.equal(fs.statSync(path.join(live.data,'.last-good')).mode&0o777,0o700);
  assert.throws(()=>storage.writeJson(live.files.reports,{bad:'schema'},Array.isArray),/Invalid new storage/);
  const previous=fs.readFileSync(live.files.reports,'utf8'),rename=fs.renameSync;
  try{
    fs.renameSync=(from,to)=>{if(to===live.files.reports)throw Error('injected rename failure');return rename(from,to);};
    assert.throws(()=>storage.writeJson(live.files.reports,[{id:'should-not-land'}],Array.isArray),/injected rename failure/);
  }finally{fs.renameSync=rename;}
  assert.equal(fs.readFileSync(live.files.reports,'utf8'),previous);
  assert(!fs.readdirSync(live.data).some(x=>x.endsWith('.tmp')));
  fs.writeFileSync(live.files.reports,'{"broken":');
  const preservedLastGood=fs.readFileSync(path.join(live.data,'.last-good','reports.json'),'utf8');
  assert.throws(()=>storage.writeJson(live.files.reports,[],Array.isArray),SyntaxError);
  assert.equal(fs.readFileSync(live.files.reports,'utf8'),'{"broken":');
  assert.equal(fs.readFileSync(path.join(live.data,'.last-good','reports.json'),'utf8'),preservedLastGood);
  storage.atomicBytes(live.files.reports,Buffer.from(before.reports));

  const folder=storage.snapshot(live.files,live.backups),verified=storage.verifySnapshot(folder);
  assert.deepEqual(Object.keys(verified).sort(),['accounts','queries','reports']);
  assert.equal(verified.reports[0].id,'report-original');
  assert.equal(fs.statSync(folder).mode&0o777,0o700);
  assert.equal(fs.statSync(path.join(folder,'accounts.json')).mode&0o777,0o600);
  const partial=storage.snapshot({reports:live.files.reports},path.join(dir,'partial-backups'));
  assert.throws(()=>storage.restore(partial,live.files),/missing existing destination/);
  const mutate={reports:[{id:'after-backup'}],accounts:{accounts:[{id:'new-student'}],sessions:[{hash:'current-session'}],submissions:[]},queries:[]};
  for(const [key,value] of Object.entries(mutate))storage.writeJson(live.files[key],value);
  const altered=contents(live.files),dry=storage.restore(folder,live.files);
  assert.equal(dry.applied,false);assert.deepEqual(contents(live.files),altered);
  assert(!fs.readdirSync(live.data).some(x=>x.startsWith('recovery-safety-')));
  // A corrupt live file is recoverable, and its bytes are retained as forensic safety data.
  fs.writeFileSync(live.files.reports,'corrupt-current-copy');
  const restored=storage.restore(folder,live.files,{apply:true});
  assert.equal(restored.applied,true);assert.equal(storage.readJson(live.files.reports)[0].id,'report-original');
  assert.deepEqual(storage.readJson(live.files.accounts).sessions,[]);
  assert.equal(storage.readJson(live.files.accounts).accounts[0].id,'student-one');
  assert.equal(fs.readFileSync(path.join(restored.safety,'reports.json'),'utf8'),'corrupt-current-copy');
  // A failure after one destination was replaced rolls all destinations back.
  for(const [key,value] of Object.entries(mutate))storage.writeJson(live.files[key],value);
  const rollbackOriginal=contents(live.files);let failed=false;
  try{
    fs.renameSync=(from,to)=>{if(to===live.files.accounts && !failed){failed=true;throw Error('injected restore failure');}return rename(from,to);};
    assert.throws(()=>storage.restore(folder,live.files,{apply:true}),/injected restore failure/);
  }finally{fs.renameSync=rename;}
  assert.deepEqual(contents(live.files),rollbackOriginal);
  const backupReports=path.join(folder,'reports.json'),originalBackup=fs.readFileSync(backupReports);
  fs.appendFileSync(backupReports,' ');
  assert.throws(()=>storage.verifySnapshot(folder),/checksum mismatch/);
  assert.throws(()=>storage.restore(folder,live.files,{apply:true}),/checksum mismatch/);
  assert.deepEqual(contents(live.files),rollbackOriginal);
  fs.writeFileSync(backupReports,originalBackup);
  const manifestFile=path.join(folder,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestFile));
  fs.writeFileSync(manifestFile,JSON.stringify({...manifest,entries:[{...manifest.entries[0],file:'../reports.json'}]}));
  assert.throws(()=>storage.verifySnapshot(folder),/Invalid backup entry/);
  fs.writeFileSync(manifestFile,JSON.stringify(manifest));

  // Force equal timestamps and descending random suffixes: the backup returned must survive pruning.
  const retention=layout('retention');seed(retention.files);
  const RealDate=Date,random=crypto.randomBytes;let sequence=0;
  try{
    global.Date=class extends RealDate {constructor(...args){super(...(args.length?args:['2026-11-19T00:00:00Z']));}static now(){return 1795046400000;}};
    crypto.randomBytes=length=>Buffer.alloc(length,255-(sequence++));
    for(let i=0;i<5;i++){const latest=storage.snapshot(retention.files,retention.backups,{retain:2});assert(fs.existsSync(latest));storage.verifySnapshot(latest);}
  }finally{global.Date=RealDate;crypto.randomBytes=random;}
  assert.equal(fs.readdirSync(retention.backups).filter(x=>x.startsWith('snapshot-')).length,2);
  assert.throws(()=>storage.snapshot(retention.files,retention.backups,{retain:0}),/retention/);
  fs.writeFileSync(retention.files.queries,'{}');const existingBackups=fs.readdirSync(retention.backups).sort();
  assert.throws(()=>storage.snapshot(retention.files,retention.backups),/Invalid backup source/);
  assert.deepEqual(fs.readdirSync(retention.backups).sort(),existingBackups);

  const migration=layout('migration');seed(migration.files);
  const record={id:'legacy-report',siteVersion:'original-v1',submittedAt:'2026-10-17T00:00:00Z',studentProfile:{grade:'G11',typeLabel:'国际学生'},recommendations:[{name:'数学与应用数学',courses:'数学分析/概率'}],scoring:{integratedMeasurements:[],studentScore:{}}};
  const oldFrozen={...record,id:'already-frozen'};oldFrozen.frozenReport=renderer.freeze(oldFrozen,parent);
  oldFrozen.frozenReport.content.conclusion='已保存原文，必须保留';oldFrozen.recommendations=[{name:'后来变化的原始专业',courses:'新课程'}];
  const rows=[record,oldFrozen,{id:'usage',recordType:'assessment_session'},{id:'incomplete',recommendations:[]}];
  storage.writeJson(migration.files.reports,rows);
  storage.writeJson(migration.files.accounts,{accounts:[{id:'student-one'}],sessions:[{hash:'still-valid-session'}],submissions:[record,oldFrozen]});
  const migrationBefore=contents(migration.files);
  let result=call('migrate-report-snapshots.js',migration);assert.equal(result.status,0,result.stderr);assert(result.stdout.includes('Dry run'));assert.deepEqual(contents(migration.files),migrationBefore);
  result=call('migrate-report-snapshots.js',migration,['--apply']);assert.equal(result.status,0,result.stderr);
  const captured=storage.readJson(migration.files.reports),ledger=storage.readJson(migration.files.accounts);
  assert(renderer.isFrozen(captured[0].frozenReport));assert.equal(captured[0].frozenReport.origin,'legacy-at-upgrade');
  assert.deepEqual(captured[1].frozenReport,oldFrozen.frozenReport);assert.equal(captured[2].frozenReport,undefined);assert.equal(captured[3].frozenReport,undefined);
  assert.equal(ledger.sessions[0].hash,'still-valid-session');assert.deepEqual(ledger.submissions[1].frozenReport,oldFrozen.frozenReport);
  const migrationAfter=contents(migration.files),backupNames=fs.readdirSync(migration.backups);
  result=call('migrate-report-snapshots.js',migration,['--apply']);assert.equal(result.status,0,result.stderr);assert.deepEqual(contents(migration.files),migrationAfter);assert.deepEqual(fs.readdirSync(migration.backups),backupNames);
  for(const key of ['reports','accounts'])storage.atomicBytes(migration.files[key],Buffer.from(migrationBefore[key]));
  const failingMigration=`const fs=require('fs'),path=require('path'),rename=fs.renameSync;let failed=false;fs.renameSync=(from,to)=>{if(to===path.join(process.env.DATA_DIR,'access-store.json')&&!failed){failed=true;throw Error('injected migration failure');}return rename(from,to);};process.argv=[process.execPath,process.argv[1],'--apply'];require(process.argv[1]);`;
  result=call('migrate-report-snapshots.js',migration,[],failingMigration);assert.equal(result.status,1);assert(result.stderr.includes('original files restored'),result.stderr);assert.deepEqual(contents(migration.files),migrationBefore);
  result=call('storage-admin.js',migration,['restore',fs.readdirSync(migration.backups).map(x=>path.join(migration.backups,x))[0]]);assert.equal(result.status,0,result.stderr);assert(result.stdout.includes('"applied": false'));assert.deepEqual(contents(migration.files),migrationBefore);
  console.log('PASS: atomic failure/corruption refusal, validated private backups and retention, checksum/tamper rejection, dry-run and rollback recovery, session revocation, idempotent frozen-report migration');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
