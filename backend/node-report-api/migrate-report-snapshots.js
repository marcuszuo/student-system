const fs=require('fs'),path=require('path'),storage=require('./storage'),snapshots=require('./report-snapshot');
const data=process.env.DATA_DIR || path.join(__dirname,'data'),files={reports:process.env.DATA_FILE || path.join(data,'reports.json'),accounts:path.join(data,'access-store.json'),queries:process.env.GAOKAO_QUERY_FILE || path.join(data,'gaokao_queries.json')};
try{
  const reports=fs.existsSync(files.reports)?storage.readJson(files.reports,Array.isArray):[];
  const ledger=fs.existsSync(files.accounts)?storage.readJson(files.accounts,v=>Array.isArray(v.accounts) && Array.isArray(v.submissions) && Array.isArray(v.sessions)):null;
  let count=0;
  const capture=report=>{const result=snapshots.capture(report,{legacy:true});if(result!==report)count++;return result;};
  const nextReports=reports.map(capture),nextLedger=ledger?{...ledger,submissions:ledger.submissions.map(capture)}:null;
  if(!process.argv.includes('--apply'))console.log('Dry run: snapshots to add:',count);
  else if(count){
    const root=process.env.BACKUP_DIR || path.join(path.dirname(data),path.basename(data)+'-backups');
    const backup=storage.snapshot(files,root);
    const originals=new Map([files.reports,...(nextLedger?[files.accounts]:[])].map(file=>[file,fs.existsSync(file)?fs.readFileSync(file):null]));
    try{
      storage.writeJson(files.reports,nextReports,Array.isArray);if(nextLedger)storage.writeJson(files.accounts,nextLedger);
    }catch(error){
      const rollbackErrors=[];
      for(const [file,bytes] of originals){try{if(bytes)storage.atomicBytes(file,bytes);else if(fs.existsSync(file))fs.unlinkSync(file);}catch(rollbackError){rollbackErrors.push(rollbackError.message);}}
      throw Error('Snapshot migration failed; '+(rollbackErrors.length?'rollback incomplete; stop the service and restore the backup':'original files restored')+'. Backup: '+backup+'; '+error.message+(rollbackErrors.length?'; '+rollbackErrors.join('; '):''));
    }
    console.log('Legacy snapshots captured:',count,'Backup:',backup);
  }else console.log('No migration needed. Existing snapshots preserved.');
}catch(error){console.error(error.message);process.exitCode=1;}
