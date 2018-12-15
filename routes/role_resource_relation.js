const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let RoleResourceRelationDao=require('../dao/dao/RoleResourceRelationDao')

const entityName='角色资源关系'

// 更新（先删后增）
router.post('/update', function (req, res) {
    
    logger.info(`新增${entityName}参数：`,req.body)
    
    const roleId=req.body.roleId
    
    RoleResourceRelationDao.removeMany({
        roleId:roleId
    }).then(()=>{
        let resourceIdArray=req.body.resourceIdArray
    
        let insertArray=[];
        for(let i=0;i<resourceIdArray.length;i++){
            let resourceId=resourceIdArray[i];
            insertArray.push({
                resourceId:resourceId,
                roleId:roleId
            })
        }
        RoleResourceRelationDao.saveMany(insertArray).then(data=>{
            res.send(Response.success(data))
        }).catch(err=>{
            res.send(Response.businessException(err));
        })
    }).catch(err=>{
        res.send(Response.businessException(err));
    })
    
})

/**
 * 根据角色id获取资源列表
 */
router.post('/listByRoleId', function (req, res) {
    
    logger.info(`根据角色id获取${entityName}的参数：`,req.body)
    
    RoleResourceRelationDao.find({
        roleId:req.body.roleId
    }).then(data=>{
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        res.send(Response.businessException(err))
    })
})


module.exports = router