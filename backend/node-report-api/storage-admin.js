// Run against a stopped service for restore. Default restore mode only verifies.
const fs=require('fs'),path=require('path'),storage=require('./storage');
const data=process.env.DATA_DIR || path.join(__dirname,'data');
const files={reports:process.env.DATA_FILE || path.join(data,'reports.json'),queries:process.env.GAOKAO_QUERY_FILE || path.join(data,'gaokao_queries.json'),accounts:path.join(data,'access-store.json')};
const root=process.env.BACKUP_DIR || path.join(path.dirname(data),path.basename(data)+'-backups');
try{
  const [command,folder,...flags]=process.argv.slice(2);
  if(command==='backup')console.log(storage.snapshot(files,root));
  else if(command==='list')console.log(fs.existsSync(root)?fs.readdirSync(root).filter(x=>x.startsWith('snapshot-')).sort().reverse().join('\n'):'No backups');
  else if(command==='verify' && folder)console.log('Verified:',Object.keys(storage.verifySnapshot(path.resolve(folder))).join(', '));
  else if(command==='restore' && folder)console.log(JSON.stringify(storage.restore(path.resolve(folder),files,{apply:flags.includes('--apply')}),null,2));
  else throw Error('Usage: node storage-admin.js backup | list | verify <folder> | restore <folder> [--apply]');
}catch(error){console.error(error.message);process.exitCode=1;}
