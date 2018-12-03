var mongoose = require('mongoose'),
    Promise = require('bluebird');

var fs=require('fs');
var path=require('path');

console.log(__dirname)

var domainFile = path.join(__dirname, '../config/domain.json');
var domainConfig=JSON.parse(fs.readFileSync( domainFile));

DB_URL = 'mongodb://'+domainConfig.ip+':27017/tcreadme';


mongoose.Promise = Promise;

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports=mongoose;