const express = require('express')
const router = express.Router()
const path=require("path")
const Response=require('../config/response')

router.get('/', function (req, res) {
    res.sendFile( path.resolve(__dirname, '../pages/index.html')  );
    // res.send(Response.businessException("地址不正确，请勿直接访问根目录！"))
})

module.exports = router