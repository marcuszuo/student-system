const fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),output=path.join(root,'exports/系统可靠性升级-20261119');
fs.mkdirSync(output,{recursive:true});const folder=fs.mkdtempSync(path.join(os.tmpdir(),'majornavi-v24-'));
const files=['server.js','access.js','storage.js','storage-admin.js','history.js','shared.js','report-snapshot.js','migrate-report-snapshots.js'];
for(const name of files)fs.copyFileSync(path.join(root,'backend/node-report-api',name),path.join(folder,name));
fs.mkdirSync(path.join(folder,'shared'));
for(const name of ['parent-report.js','report-pdf.js','report-list-tools.js']){const relative='shared/'+name;fs.copyFileSync(path.join(root,'assets/js',name),path.join(folder,relative));files.push(relative);}
const manifest={version:24,files:files.map(file=>({path:file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,file))).digest('hex')}))};
fs.writeFileSync(path.join(folder,'release-manifest.json'),JSON.stringify(manifest,null,2));
fs.copyFileSync(path.join(root,'backend/node-report-api/upgrade-v24.js'),path.join(folder,'upgrade-v24.js'));
fs.writeFileSync(path.join(folder,'upgrade.sh'),'#!/usr/bin/env bash\nset -euo pipefail\nrelease_dir="$(cd -- "$(dirname -- "$0")" && pwd)"\nnode "$release_dir/upgrade-v24.js" --apply\n');
fs.writeFileSync(path.join(folder,'README.txt'),'MajorNavi V24 server update\nUpload this ZIP to /root and extract into /root/majornavi-v24.\nRun: bash /root/majornavi-v24/upgrade.sh\nThe updater checks files, stops only majornavi-report-api, backs up data, captures legacy report text, and restarts the same service.\nIt does not reset the admin password. Existing PM2 data paths are reused without displaying credentials.\nVerify API capabilities version 3/historyPagination/frozenReports, then publish the frontend.\nBackups are local to the same server, not off-site disaster recovery.\n');
cp.execFileSync(process.execPath,[path.join(folder,'upgrade-v24.js'),'--check'],{stdio:'inherit'});
const zip=path.join(output,'历史报告与备份升级-服务端V24.zip');if(fs.existsSync(zip))fs.unlinkSync(zip);
cp.execFileSync('zip',['-q','-r',zip,'.'],{cwd:folder});
fs.writeFileSync(path.join(output,'服务端包校验.txt'),'SHA256 '+crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex')+'\n');
console.log('Prepared:',zip);fs.rmSync(folder,{recursive:true,force:true});
