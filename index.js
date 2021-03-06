let express = require('express');
let cookieParser = require('cookie-parser')
let util = require('util');
let fs = require("fs");
let path = require("path");
let bodyParser = require('body-parser');
let multer  = require('multer');

const log4js= require('./config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const routeConfig= require('./config/route-config')
const crosConfig=  require('./config/cros-config')




let app = express();

//设置允许跨域访问.
crosConfig.init(app);

app.use(express.static('public'));
log4js.useLogger(app,logger)

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: false
}));

multer({dest:'uploads/'});

//设置路由信息
routeConfig.useRouter(app);



//
// app.use(cookieParser())
//


//
//




//读取json文件
fs.readFile('config/domain.json', 'utf-8', function(err, data) {
    if (err) {
        console.log('读取域名配置文件出错，请检查！');
    } else {
        data=JSON.parse(data);
    
        var fs=require('fs');
        var domainFile = path.join(__dirname, './config/domain.json');
        var domainConfig=JSON.parse(fs.readFileSync( domainFile));
        console.log('...................')
        // var server = app.listen(8081,'0.0.0.0',function () {
        let server = app.listen(8081,domainConfig.ip,function (err) {
            const host = server.address().address
            const port = server.address().port
    
            logger.info("tcreadme后台服务成功启动，访问地址为 http://%s:%s", host, port)
        
            
        
        })
        
    }
});



