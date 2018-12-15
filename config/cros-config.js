
exports.init = function (app) {//用来与express结合
    //设置允许跨域访问.
    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Content-Type', 'application/json;charset=utf-8');
        next();
    });
}