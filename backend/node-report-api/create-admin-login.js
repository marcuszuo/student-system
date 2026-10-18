// Run on the API server. Files contain credentials and must stay outside the public website.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {passwordHash}=require('./access');
if(!process.argv[2])throw Error('Specify a private output directory outside the public website.');
const dir=path.resolve(process.argv[2]);fs.mkdirSync(dir,{recursive:true,mode:0o700});
const password=crypto.randomBytes(18).toString('base64url');
const env=path.join(dir,'admin-login.env'),note=path.join(dir,'admin-first-login.txt');
if(fs.existsSync(env)||fs.existsSync(note))throw Error('Setup files already exist; refusing to replace credentials.');
fs.writeFileSync(env,`ADMIN_USERNAME=admin\nADMIN_PASSWORD_HASH=${passwordHash(password)}\n`,{mode:0o600,flag:'wx'});
fs.writeFileSync(note,`管理账号：admin\n初始密码：${password}\n请妥善保存，勿上传到网站或Git仓库。\n`,{mode:0o600,flag:'wx'});
console.log('Created admin-login.env and admin-first-login.txt in the specified private directory.');
