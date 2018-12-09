const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let Role=require('../dao/model/role')


// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增角色参数：",req.body)
    
    let whereObj={
        name:req.body.name
    };
    
    let role = new Role(req.body);
    
    Role.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            
            res.send(Response.businessException("角色已存在！"))
            
        }else{
    
            role.save().then(data=>{
                
                res.send(Response.success(data));
                
            }).catch(data=>{
                logger.info("新增角色异常！",data)
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
    
    logger.info("删除角色参数：",req.body)
    
    let whereObj={
        name:req.body.name,
    };
    
    
    Role.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            
            Role.remove(whereObj).then(data=>{
                res.send(Response.success());
            }).catch(data=>{
                res.send(Response.businessException("删除角色失败"));
            })
            
        }else{
            
            res.send(Response.businessException("未找到对应角色"))
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})


// 修改角色信息
router.post('/update', function (req, res) {
    
    logger.info("修改角色信息参数：",req.body)
    
    let whereObj={
        name:req.body.originalName,
    };
    
    let updateObj=JSON.parse(JSON.stringify(req.body));
    
    Role.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            Role.update(whereObj,updateObj).then(data=>{
                res.send(Response.success());
            }).catch(err=>{
                logger.info(err)
                res.send(Response.businessException("修改角色信息失败"))
            })
            
        }else{
            
            res.send(Response.businessException("未找到对应角色"))
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})

// 获取用户列表
router.post('/list', function (req, res) {
    
    logger.info("获取角色列表的参数：",req.body)
    
    Role.find().then(data=>{
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
})











module.exports = router