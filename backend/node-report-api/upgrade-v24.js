// This updater contains no credentials. It reuses the existing PM2 environment without printing it.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const release=__dirname,target='/var/www/majornavi-report-api',service='majornavi-report-api';
function run(file,args,options={}){return cp.execFileSync(file,args,{stdio:'pipe',...options}).toString().trim();}
async function main(){
  const manifest=JSON.parse(fs.readFileSync(path.join(release,'release-manifest.json'),'utf8'));
  for(const item of manifest.files){
    if(item.path.includes('..') || path.isAbsolute(item.path))throw Error('Invalid release path');
    const file=path.join(release,item.path),bytes=fs.readFileSync(file);
    if(crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Release checksum mismatch: '+item.path);
    if(item.path.endsWith('.js'))run(process.execPath,['--check',file]);
  }
  if(!process.argv.includes('--apply')){console.log('Release checks passed. No server files changed.');return;}
  const list=JSON.parse(run('pm2',['jlist'])),app=list.find(x=>x.name===service);
  if(!app || path.resolve(app.pm2_env.pm_exec_path)!==path.join(target,'server.js'))throw Error('Existing PM2 service path does not match. No changes made.');
  const oldEnv=Object.fromEntries(Object.entries(app.pm2_env).filter(([,v])=>['string','number','boolean'].includes(typeof v)).map(([key,value])=>[key,String(value)]));
  const env={...process.env,...oldEnv,DATA_DIR:oldEnv.DATA_DIR || path.join(target,'data')};
  for(const key of ['DATA_DIR','DATA_FILE','GAOKAO_QUERY_FILE','BACKUP_DIR'])if(env[key])env[key]=path.resolve(app.pm2_env.pm_cwd || target,env[key]);
  const backup='/root/majornavi-before-v24-'+new Date().toISOString().replace(/[:.]/g,'-');
  let stopped=false,codeCopied=false;
  try{
    run('pm2',['stop',service]);stopped=true;
    run('cp',['-a',target,backup]);
    console.log('Code/data safety copy:',backup);
    console.log('Verified data backup:',run(process.execPath,[path.join(release,'storage-admin.js'),'backup'],{env}));
    codeCopied=true;
    for(const item of manifest.files){const destination=path.join(target,item.path);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(release,item.path),destination);}
    console.log(run(process.execPath,[path.join(target,'migrate-report-snapshots.js'),'--apply'],{env}));
    run('pm2',['restart',service]);stopped=false;
    let ready=false;
    for(let attempt=0;attempt<5;attempt++){
      try{const response=await fetch('http://127.0.0.1:'+(oldEnv.PORT || 8787)+'/api/auth/capabilities',{signal:AbortSignal.timeout(3000)});const caps=await response.json();if(caps.historyPagination && caps.frozenReports){ready=true;break;}}catch{}
      await new Promise(resolve=>setTimeout(resolve,1000));
    }
    if(!ready)throw Error('New API did not pass its local capability check.');
    try{run('pm2',['save']);}catch{console.log('Service is healthy; PM2 save failed. Run pm2 save manually.');}
    console.log('V24 server upgrade completed. Administrator password and data retained.');
  }catch(error){
    if(codeCopied){
      try{run('pm2',['stop',service]);}catch{}
      const failures=[];
      for(const item of manifest.files){try{const previous=path.join(backup,item.path),destination=path.join(target,item.path);if(fs.existsSync(previous))fs.copyFileSync(previous,destination);else if(fs.existsSync(destination))fs.unlinkSync(destination);}catch(failure){failures.push(failure.message);}}
      console.error(failures.length?'Code rollback incomplete; restore from '+backup:'Previous code restored. Data was not overwritten; any completed snapshot additions are retained.');
    }
    if(stopped || codeCopied){try{run('pm2',['restart',service]);}catch{console.error('Restart failed; use the safety copy:',backup);}}
    throw error;
  }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
