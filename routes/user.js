const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let User=require('../dao/model/user')
let UserDao=require('../dao/dao/UserDao')
let UserRoleRelationDao=require('../dao/dao/UserRoleRelationDao')
let ResourceDao=require('../dao/dao/ResourceDao')

let RoleResourceRelationDao=require('../dao/dao/RoleResourceRelationDao')
const entityName="用户"

// 新增
router.post('/add', function (req, res) {
    
    logger.info(`新增${entityName}参数：`,req.body)
    
    UserDao.find({
        username:req.body.username
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject(`${entityName}已存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let user = new User(req.body);
        
        return UserDao.save(user).then(data=>{
            res.send(Response.success(data));
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
    
})


// 删除
router.post('/remove', function (req, res) {
    
    logger.info(`删除${entityName}参数：`,req.body)
    
    let userId=req.body._id
    
    UserDao.remove(userId).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
    
})

// 登录
router.post('/login', function (req, res) {
    
    logger.info(`${entityName}登录参数：`,req.body)
    
    let username=req.body.username
    
    let whereObj={
        username:username
    };
    
    UserDao.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            return Promise.resolve();
        }else{
            return Promise.reject("账号不存在！");
        }
    }).then(()=>{
        whereObj={
            username:username,
            password:req.body.password
        };
    
        return UserDao.find(whereObj).then(data=>{
            if(data && data.length>0){
                res.send(Response.success(data[0]));
            
            }else{
                return Promise.reject("密码不正确！")
            }
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

// 修改用户信息
router.post('/update', function (req, res) {
    
    logger.info("修改用户信息参数：",req.body)
    
    let updateObj=JSON.parse(JSON.stringify(req.body));
    
    UserDao.update({
        _id:req.body._id
    },updateObj).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

// 获取用户列表
router.get('/list', function (req, res) {
    
    logger.info("获取用户列表的参数：",req.body)
    
    UserDao.find().then(data=>{
    
        res.send(Response.success(data));
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

/**
 * 根据用户id获取对应的资源列表（分级）
 */
router.post('/getResourcesByUserId', function (req, res) {
    
    logger.info("根据用户id获取对应的资源列表参数：",req.body)
    
    //首先判断当前用户是否是超管，是的话返回所有资源
    UserDao.find({
        _id:req.body.userId
    }).then(data=>{
        let isAdmin=data[0].isAdmin;
        if(isAdmin){
            return ResourceDao.findWithLevel().then(data=>{
                res.send(Response.success(data))
            })
        }else{
            return UserRoleRelationDao.find({
                userId:req.body.userId
            }).then(data=>{
        
                let roleIdArray=[];
                data.forEach(item=>{
                    roleIdArray.push(item.roleId)
                })
        
                return RoleResourceRelationDao.find({
                    roleId:{$in:roleIdArray}
                }).then(data=>{
                    let resourceIdArray=[];
                    data.forEach(item=>{
                        resourceIdArray.push(item.resourceId)
                    })
            
                    return Promise.resolve(resourceIdArray)
            
                })
        
            }).then((resourceIdArray)=>{
        
                return ResourceDao.findWithLevel({
                    _id:{$in:resourceIdArray}
                }).then(data=>{
                    res.send(Response.success(data))
                })
            })
        }
        
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
    
    
    
    
    
})











module.exports = router