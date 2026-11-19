const fs=require('fs'),path=require('path'),crypto=require('crypto');
function digest(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function validData(key,value){return key==='accounts'?Boolean(value && Array.isArray(value.accounts) && Array.isArray(value.sessions) && Array.isArray(value.submissions)):['reports','queries'].includes(key) && Array.isArray(value);}
function atomicBytes(file,bytes){
  fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  const temp=file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';let fd;
  try{fd=fs.openSync(temp,'wx',0o600);fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;fs.renameSync(temp,file);}
  finally{if(fd!==undefined)fs.closeSync(fd);if(fs.existsSync(temp))fs.unlinkSync(temp);}
}
function readJson(file,validate){
  const value=JSON.parse(fs.readFileSync(file,'utf8'));
  if(validate && !validate(value))throw Error('Invalid storage format: '+path.basename(file));return value;
}
function writeJson(file,value,validate){
  if(validate && !validate(value))throw Error('Invalid new storage format');
  if(fs.existsSync(file)){
    readJson(file,validate); // Never silently overwrite corrupt data with an empty array.
    atomicBytes(path.join(path.dirname(file),'.last-good',path.basename(file)),fs.readFileSync(file));
  }
  atomicBytes(file,Buffer.from(JSON.stringify(value,null,2)+'\n'));
}
function snapshot(files,backupRoot,{retain=30}={}){
  if(!Number.isInteger(retain) || retain<1)throw Error('Backup retention must be a positive integer');
  fs.mkdirSync(backupRoot,{recursive:true,mode:0o700});
  const name='snapshot-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(3).toString('hex');
  const temp=path.join(backupRoot,'.'+name),destination=path.join(backupRoot,name),entries=[];
  fs.mkdirSync(temp,{mode:0o700});
  try{
    for(const [key,file] of Object.entries(files)){
      if(!fs.existsSync(file))continue;
      const bytes=fs.readFileSync(file),value=JSON.parse(bytes);
      if(!validData(key,value))throw Error('Invalid backup source format: '+key);
      atomicBytes(path.join(temp,key+'.json'),bytes);entries.push({key,file:key+'.json',bytes:bytes.length,sha256:digest(bytes)});
    }
    if(!entries.length)throw Error('No data files available to back up');
    atomicBytes(path.join(temp,'manifest.json'),Buffer.from(JSON.stringify({version:1,createdAt:new Date().toISOString(),entries},null,2)));
    fs.renameSync(temp,destination);
    const names=fs.readdirSync(backupRoot).filter(n=>n!==name && n.startsWith('snapshot-') && fs.statSync(path.join(backupRoot,n)).isDirectory()).sort().reverse();
    // Always retain this completed backup, including when several snapshots share a millisecond.
    for(const old of names.slice(retain-1))fs.rmSync(path.join(backupRoot,old),{recursive:true});
    return destination;
  }catch(error){fs.rmSync(temp,{recursive:true,force:true});throw error;}
}
function verifySnapshot(folder){
  const manifest=readJson(path.join(folder,'manifest.json'));
  if(manifest.version!==1 || !Array.isArray(manifest.entries) || !manifest.entries.length)throw Error('Invalid backup manifest');
  const result={};
  for(const entry of manifest.entries){
    if(!['reports','accounts','queries'].includes(entry.key) || entry.file!==entry.key+'.json' || result[entry.key])throw Error('Invalid backup entry');
    const bytes=fs.readFileSync(path.join(folder,entry.file));
    if(bytes.length!==entry.bytes || digest(bytes)!==entry.sha256)throw Error('Backup checksum mismatch: '+entry.key);
    const value=JSON.parse(bytes);
    if(!validData(entry.key,value))throw Error('Backup schema mismatch: '+entry.key);result[entry.key]=value;
  }return result;
}
function restore(folder,files,{apply=false}={}){
  const values=verifySnapshot(folder);for(const key of Object.keys(values))if(!files[key])throw Error('Unknown restore destination');
  for(const [key,file] of Object.entries(files))if(fs.existsSync(file) && !Object.hasOwn(values,key))throw Error('Backup is missing existing destination: '+key);
  if(!apply)return {verified:Object.keys(values),applied:false};
  if(values.accounts)values.accounts.sessions=[]; // Old revoked sessions must not become usable again after recovery.
  const originals=new Map(),safety=path.join(path.dirname(files.accounts || files.reports),'recovery-safety-'+Date.now()+'-'+crypto.randomBytes(3).toString('hex'));
  fs.mkdirSync(safety,{mode:0o700});
  for(const key of Object.keys(values)){
    const bytes=fs.existsSync(files[key])?fs.readFileSync(files[key]):null;originals.set(key,bytes);
    if(bytes)atomicBytes(path.join(safety,key+'.json'),bytes);
  }
  try{for(const [key,value] of Object.entries(values))atomicBytes(files[key],Buffer.from(JSON.stringify(value,null,2)+'\n'));}
  catch(error){for(const [key,bytes] of originals){if(bytes)atomicBytes(files[key],bytes);else if(fs.existsSync(files[key]))fs.unlinkSync(files[key]);}throw error;}
  return {verified:Object.keys(values),applied:true,safety};
}
module.exports={readJson,writeJson,snapshot,verifySnapshot,restore,atomicBytes};
