const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let UserRoleRelationDao=require('../dao/dao/UserRoleRelationDao')

const entityName='人员角色关系'
// 更新（先删后增）
router.post('/update', function (req, res) {
    
    logger.info(`新增${entityName}参数：`,req.body)
    
    const userId=req.body.userId
    
    UserRoleRelationDao.removeMany({
        userId:userId
    }).then(()=>{
        let roleIdArray=req.body.roleIdArray
    
        let insertArray=[];
        for(let i=0;i<roleIdArray.length;i++){
            let roleId=roleIdArray[i];
            insertArray.push({
                roleId:roleId,
                userId:userId
            })
        }
        UserRoleRelationDao.saveMany(insertArray).then(data=>{
            res.send(Response.success(data))
        }).catch(err=>{
            res.send(Response.businessException(err));
        })
    }).catch(err=>{
        res.send(Response.businessException(err));
    })
    
    
})

/**
 * 根据用户id获取角色列表
 */
router.post('/listByUserId', function (req, res) {
    
    logger.info(`根据用户id获取${entityName}列表的参数：`,req.body)
    
    UserRoleRelationDao.find({
        userId:req.body.userId,
    }).then(data=>{
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        res.send(Response.businessException(err))
    })
})















module.exports = router