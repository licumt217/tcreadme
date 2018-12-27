const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let RoleDao=require('../dao/dao/RoleDao')
let Role=require('../dao/model/role')


// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增角色参数：",req.body)
    
    let whereObj={
        name:req.body.name
    };
    
    RoleDao.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            
            return Promise.reject("角色已存在！")
            
        }else{
            return Promise.resolve()
        
        }
    }).then(()=>{
        
        let role = new Role(req.body);
        
        return RoleDao.save(role).then(data=>{
        
            res.send(Response.success(data));
        
        })
        
    }).catch(err=>{
        logger.info(err)
        err=typeof err==='object'?"新增角色异常":err
        res.send(Response.businessException(err))
    })
})


// 删除
router.post('/remove', function (req, res) {
    
    logger.info("删除角色参数：",req.body)
    
    let id=req.body._id
    
    RoleDao.remove(id).then(data=>{
        res.send(Response.success());
    }).catch(err=>{
        res.send(Response.businessException(err));
    })
})


// 修改角色信息
router.post('/update', function (req, res) {
    
    logger.info("修改角色信息参数：",req.body)
    
    let whereObj={
        _id:req.body.id,
    };
    
    RoleDao.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            return Promise.resolve()
            
        }else{
            return Promise.reject("未找到对应角色")
        }
    }).then(()=>{
        
        let updateObj=JSON.parse(JSON.stringify(req.body));
        
        RoleDao.update(whereObj,updateObj).then(data=>{
            res.send(Response.success());
        }).catch(err=>{
            res.send(Response.businessException(err))
        })
    }).catch(err=>{
        res.send(Response.businessException(err))
    })
})

// 获取用户列表
router.post('/list', function (req, res) {
    
    logger.info("获取角色列表的参数：",req.body)
    
    RoleDao.find().then(data=>{
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        res.send(Response.businessException(err))
    })
})











module.exports = router