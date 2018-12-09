const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let RoleResourceRelation=require('../dao/model/role_resource_relation')


// 更新（先删后增）
router.post('/update', function (req, res) {
    
    logger.info("新增角色资源关系参数：",req.body)
    
    let removeObj={
        roleId:req.body.roleId
    };
    
    logger.info(removeObj)
    remove(removeObj).then(data=>{
        let roleId=req.body.roleId;
        let resourceIdArray=req.body.resourceIdArray
        
        let insertArray=[];
        for(let i=0;i<resourceIdArray.length;i++){
            let resourceId=resourceIdArray[i];
            insertArray.push({
                resourceId:resourceId,
                roleId:roleId
            })
        }
        RoleResourceRelation.collection.insert(insertArray).then(data=>{
            res.send(Response.success(data))
        }).catch(err=>{
            logger.info("新增角色资源关系异常！",err)
            res.send(Response.systemException());
        })
        
    },err=>{
        logger.info(err)
        res.send(Response.businessException(err));
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err));
    });
    
    
})

/**
 * 根据角色id获取资源列表
 */
router.post('/listByRoleId', function (req, res) {
    
    logger.info("根据角色id获取资源列表的参数：",req.body)
    let whereObj={
        roleId:req.body.roleId,
    };
    
    
    RoleResourceRelation.find(whereObj).then(data=>{
        
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException("根据角色id获取资源列表异常"))
    })
})

/**
 * 根据条件删除
 * @param whereObj
 * @returns {Promise}
 */
function remove(whereObj) {
    return new Promise((resolve,reject)=>{
        RoleResourceRelation.find(whereObj).then(data=>{
            logger.info(".........1",data)
        
            if(data && data.length>0){
                logger.info(".........2",whereObj)
            
                RoleResourceRelation.deleteMany(whereObj).then(data=>{
                    logger.info(".........4",data)
                    resolve()
                }).catch(err=>{
                    logger.info(err)
                    reject("删除角色资源关系失败")
                })
            
            }else{
                logger.info(".........3")
                resolve()
            }
        }).catch(err=>{
            logger.info(err)
            reject(Response.systemException())
        })
    });
}













module.exports = router