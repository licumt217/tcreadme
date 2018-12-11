const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let RoleResourceRelation=require('../../dao/model/role_resource_relation')
const entityName="角色资源关系";
let errorMsg="";

let RoleResourceRelationDao={
    save(roleResourceRelation){
        return new Promise((resolve,reject)=>{
            if(roleResourceRelation){
                roleResourceRelation.save().then(data=>{
                    resolve(data);
                }).catch(err=>{
                    errorMsg=`新增${entityName}异常！`
                    logger.info(errorMsg,err)
                    reject(errorMsg)
                })
            }else{
                errorMsg=`新增${entityName}不能为空！`
                logger.info(errorMsg)
                reject(errorMsg)
            }
        })
    },
    find(whereObj){
        return new Promise((resolve,reject)=>{
            
            if(!whereObj){
                whereObj={}
            }
            RoleResourceRelation.find(whereObj).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg=`根据条件查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    },
    remove(id){
        return new Promise((resolve,reject)=>{
    
            RoleResourceRelation.remove({
                _id:id
            }).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg=`删除${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    },
    update(whereObj,updateObj){
        return new Promise((resolve,reject)=>{
    
            RoleResourceRelation.update(whereObj,updateObj).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg=`修改${entityName}信息异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    }
    
    
    
    
    

    
    
    
}






module.exports = RoleResourceRelationDao