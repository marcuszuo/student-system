const fs=require('fs'),path=require('path');
module.exports=name=>require(fs.existsSync(path.join(__dirname,'shared',name+'.js'))?path.join(__dirname,'shared',name+'.js'):path.join(__dirname,'../../assets/js',name+'.js'));
