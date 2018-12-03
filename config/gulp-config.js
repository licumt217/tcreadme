/**
 * Created by liqiang on 2017/5/23.
 */
let path = require('path')
let projectName='zcq';

module.exports = {
    local: {
        env: {
            NODE_ENV: '"local"'
        },
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        cssSourceMap: true,
        sourceMap: true
    },
    prep: {
        env: {
            NODE_ENV: '"prep"'
        },
        index: path.resolve(__dirname, '../'+projectName+'/index.html'),
        assetsRoot: path.resolve(__dirname, '../'+projectName),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/'+projectName+'/',
        productionSourceMap: false, //是否打开打包映射文件
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        sourceMap: false
    }
}