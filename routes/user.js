const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let User=require('../dao/model/user')


// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增用户参数：",req.body)
    
    let whereObj={
        username:req.body.username
    };
    
    let user = new User(req.body);
    
    User.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            
            res.send(Response.businessException("用户已存在！"))
            
        }else{
            
            user.save().then(data=>{
                
                res.send(Response.success(data));
                
            }).catch(data=>{
                logger.info("新增用户异常！",data)
                res.send(Response.systemException());
            })
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})


// 删除
router.post('/remove', function (req, res) {
    
    logger.info("删除用户参数：",req.body)
    
    let whereObj={
        username:req.body.username,
        password:req.body.password
    };
    
    
    User.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            User.remove(whereObj).then(data=>{
                res.send(Response.success());
            }).catch(data=>{
                res.send(Response.businessException("删除用户失败"));
            })
            
        }else{
    
            res.send(Response.businessException("未找到对应用户"))
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})

// 登录
router.post('/login', function (req, res) {
    
    logger.info("用户登录参数：",req.body)
    
    let whereObj={
        username:req.body.username,
        password:req.body.password
    };
    
    
    User.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            res.send(Response.success());
            
        }else{
    
            res.send(Response.businessException("未找到对应用户"))
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})

// 修改用户信息
router.post('/update', function (req, res) {
    
    logger.info("修改用户信息参数：",req.body)
    
    let whereObj={
        username:req.body.username,
        password:req.body.password,
    };
    
    let updateObj=JSON.parse(JSON.stringify(req.body));
    updateObj.password=req.body.newPassword
    
    
    User.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            User.update(whereObj,updateObj).then(data=>{
                res.send(Response.success());
            }).catch(err=>{
                logger.info(err)
                res.send(Response.businessException("修改用户信息失败"))
            })
            
        }else{
    
            res.send(Response.businessException("未找到对应用户"))
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})

// 获取用户列表
router.post('/list', function (req, res) {
    
    logger.info("获取用户列表的参数：",req.body)
    
    User.find().then(data=>{
    
        res.send(Response.success(data));
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})











module.exports = router