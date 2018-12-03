let express = require('express');
let cookieParser = require('cookie-parser')
let util = require('util');
let fs = require("fs");
let bodyParser = require('body-parser');
let multer  = require('multer');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 日志相关
const log4js= require('./config/log-config')
const logger = log4js.getLogger()//根据需要获取logger
const errlogger = log4js.getLogger('err')
const othlogger = log4js.getLogger('oth')

const Response=require('./config/response')

let User=require('./dao/model/user')

let app = express();
log4js.useLogger(app,logger)
app.use(express.static('public'));
app.use(cookieParser())

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.use(multer({ dest: '/uploadImages/'}).array('image'));



app.post('/file_upload', function (req, res) {
    
    console.log(req.files[0]);  // 上传的文件信息
    
    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
            }
            console.log( response );
            res.end( JSON.stringify( response ) );
        });
    });
})
// 创建 application/x-www-form-urlencoded 编码解析

app.post('/process_post', urlencodedParser, function (req, res) {
    
    // 输出 JSON 格式
    var response = {
        "first_name":req.body.first_name,
        "last_name":req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})





app.get('/index', function (req, res) {
    res.sendFile( __dirname + "/pages/" + "index.html" );
})

app.get('/process_get', function (req, res) {
    
    // 输出 JSON 格式
    var response = {
        "first_name":req.query.first_name,
        "last_name":req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})


//  主页输出 "Hello World"
app.get('/', function(req, res) {
    console.log("Cookies: " + util.inspect(req.cookies));
})

//  POST 请求
app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
})

//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})


// var server = app.listen(8081,'0.0.0.0',function () {
var server = app.listen(8081,'localhost',function () {
    
    console.log(server)
    
    var host = server.address().address
    var port = server.address().port
    
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
    
})