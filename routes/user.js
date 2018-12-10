const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let User=require('../dao/model/user')
let UserRoleRelation=require('../dao/model/user_role_relation')
let Resource=require('../dao/model/resource')

let RoleResourceRelation=require('../dao/model/role_resource_relation')

let UserDao=require('../dao/dao/UserDao')
// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增用户参数：",req.body)
    
    let whereObj={
        username:req.body.username
    };
    
    UserDao.find(whereObj).then(data=>{
        if(data && data.length>0){
        
            res.send(Response.businessException("用户已存在！"))
        
        }else{
            return new Promise((resolve,reject)=>{
                resolve();
            })
        }
    }).then(()=>{
        let user = new User(req.body);
        
        UserDao.save(user).then(data=>{
            res.send(Response.success(data));
        },err=>{
            res.send(Response.businessException(err));
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException(err))
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
        username:req.body.username
    };
    
    
    
    User.find(whereObj).then(data=>{
        
        if(data && data.length>0){
    
            let whereObj={
                username:req.body.username,
                password:req.body.password
            };
            User.find(whereObj).then(data=>{
        
                if(data && data.length>0){
            
            
                    res.send(Response.success());
            
                }else{
            
                    res.send(Response.businessException("密码不正确！"))
                }
            }).catch(err=>{
                logger.info(err)
                res.send(Response.systemException())
            })
            
        }else{
    
            res.send(Response.businessException("账号不存在！"))
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

/**
 * 根据用户id获取对应的资源列表（分级）
 */
router.post('/getResourcesByUserId', function (req, res) {
    
    
    
    logger.info("根据用户id获取对应的资源列表参数：",req.body)
    
    
    let whereObj={
        userId:req.body.userId,
    };
    
    UserRoleRelation.find(whereObj).then(data=>{
        
        logger.info("根据角色id获取资源列表的参数：",data)
        let roleIdArray=[];
        data.forEach(item=>{
            roleIdArray.push(item.roleId)
        })
        whereObj={
            roleId:{$in:roleIdArray}
        };
        
        
        RoleResourceRelation.find(whereObj).then(data=>{
            let resourceIdArray=[];
            data.forEach(item=>{
                resourceIdArray.push(item.resourceId)
            })
            
            whereObj={
                _id:{$in:resourceIdArray}
            };
    
            Resource.find(whereObj).then(data=>{
                
                data=JSON.parse(JSON.stringify(data))
                let firstLevel=[]
                data.forEach((item)=>{
                    if(item.parentCode==='0000'){
                        firstLevel.push(item)
                    }
                })
                
                for(let i=0;i<firstLevel.length;i++){
                    
                    let children=[]
                    data.forEach((item)=>{
                        if(item.parentCode===firstLevel[i].code){
                            children.push(item)
                        }
                    })
                    
                    
                    firstLevel[i].children=children;
                    
                }
                
                
                res.send(Response.success(firstLevel))
            }).catch(err=>{
                logger.info(err)
                res.send(Response.systemException())
            })
            
        }).catch(err=>{
            logger.info(err)
            res.send(Response.businessException("根据角色id获取资源列表异常"))
        })
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException("根据用户id获取角色列表异常"))
    })
    
    
    
})











module.exports = router