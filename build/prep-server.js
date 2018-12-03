







/**
 * Created by liqiang on 2017/5/30.
 */
// https://github.com/shelljs/shelljs
//打包文件 命令 npm run build
const fs=require('fs')
require('shelljs/global')
env.NODE_ENV = 'production'

let path = require('path')
let config = require('../config/gulp-config')

let assetsPath = config.prep.assetsRoot
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
let toCopyArray=['config','dao','logs','pages','public','routes']

toCopyArray.forEach((item)=>{
    mkdir('-p', assetsPath+'/'+item)
})

toCopyArray.forEach((item)=>{
    cp('-R', item+'/*', assetsPath+"/"+item)
})


cp('-R', 'index.js', assetsPath)
cp('-R', 'package.json', assetsPath)


let file='../zcq/config/domain.json'
//读取json文件
fs.readFile(file, 'utf-8', function(err, data) {
    if (err) {
        console.log('读取域名配置文件出错，请检查！',err);
    } else {
        data=JSON.parse(data);
        data.ip='0.0.0.0';
        fs.writeFileSync(file, JSON.stringify(data,null,4));
        
    }
});

