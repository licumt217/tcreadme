/**
 * Created by liqiang on 2017/5/23.
 */
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var envConfig = require('../config')
var opn = require('opn')
var webpackDevMiddleware=require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');

var app = express()
var port = process.env.PORT || envConfig.local.port
var webpackConfig = process.env.NODE_ENV === 'testing'
    ? require('./webpack.prod.config')
    : require('./webpack.local.config')


//热加载和浏览器实时更新
var devClient = path.join(__dirname, '../build/dev-client');
Object.keys(webpackConfig.entry).forEach(function (name, i) {
    var extras = [devClient]
    extras=extras.concat(webpackConfig.entry[name])
    webpackConfig.entry[name] = extras
})

console.log('........................')


var compiler = webpack(webpackConfig)
hotMiddleware=hotMiddleware(compiler)


// 监听html文件改变事件，浏览器实时刷新
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件 reload,这个事件会在dev-client.js中接受到，然后刷新
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

app.use(webpackDevMiddleware(compiler,{
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(hotMiddleware)





app.use(express.static('tcweixin'));


// app.get('/', function (req,res,next) {
//     console.log('2323')
//     next()
// })

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port+'/bdpage/bdindex'
    console.log('Listening at ' + uri + '\n')
    setTimeout(function () {
        opn(uri)
    },2000)
})