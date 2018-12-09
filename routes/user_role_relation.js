const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let UserRoleRelation=require('../dao/model/user_role_relation')


// 更新（先删后增）
router.post('/update', function (req, res) {
    
    logger.info("新增人员角色关系参数：",req.body)
    
    let removeObj={
        userId:req.body.userId
    };
    
    logger.info(removeObj)
    remove(removeObj).then(data=>{
        let userId=req.body.userId;
        let roleIdArray=req.body.roleIdArray
        
        let insertArray=[];
        for(let i=0;i<roleIdArray.length;i++){
            let roleId=roleIdArray[i];
            insertArray.push({
                roleId:roleId,
                userId:userId
            })
        }
        UserRoleRelation.collection.insert(insertArray).then(data=>{
            res.send(Response.success(data))
        }).catch(err=>{
            logger.info("新增人员角色关系异常！",err)
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
 * 根据用户id获取角色列表
 */
router.post('/listByUserId', function (req, res) {
    
    logger.info("根据用户id获取资源列表的参数：",req.body)
    let whereObj={
        userId:req.body.userId,
    };
    
    UserRoleRelation.find(whereObj).then(data=>{
        
        res.send(Response.success(data));
        
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException("根据用户id获取资源列表异常"))
    })
})



/**
 * 根据条件删除
 * @param whereObj
 * @returns {Promise}
 */
function remove(whereObj) {
    return new Promise((resolve,reject)=>{
        UserRoleRelation.find(whereObj).then(data=>{
        
            if(data && data.length>0){
            
                UserRoleRelation.deleteMany(whereObj).then(data=>{
                    resolve()
                }).catch(err=>{
                    logger.info(err)
                    reject("删除人员角色关系失败")
                })
            
            }else{
                resolve()
            }
        }).catch(err=>{
            logger.info(err)
            reject(Response.systemException())
        })
    });
}













module.exports = router