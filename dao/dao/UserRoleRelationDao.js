const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let UserRoleRelation=require('../../dao/model/user_role_relation')
const entityName="用户角色关系";
let errorMsg="";

let RoleResourceRelationDao={
    save(userRoleRelation){
        return new Promise((resolve,reject)=>{
            if(userRoleRelation){
                userRoleRelation.save().then(data=>{
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
    saveMany(userRoleRelationArray){
        return new Promise((resolve,reject)=>{
            if(userRoleRelationArray){
                UserRoleRelation.collection.insert(userRoleRelationArray).then(data=>{
                    resolve(data);
                }).catch(err=>{
                    errorMsg=`新增${entityName}异常！`
                    logger.info(errorMsg,err)
                    reject(errorMsg)
                })
            }else{
                errorMsg=`批量新增${entityName}不能为空！`
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
            UserRoleRelation.find(whereObj).then(data=>{
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
    
            UserRoleRelation.remove({
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
    removeMany(whereObj){
        return new Promise((resolve,reject)=>{
            if(whereObj){
                UserRoleRelation.deleteMany(whereObj).then(()=>{
                    resolve()
                }).catch(err=>{
                    errorMsg=`删除${entityName}异常！`
                    logger.info(err)
                    reject(errorMsg)
                })
            }else{
                resolve()
            }
        })
    },
    update(whereObj,updateObj){
        return new Promise((resolve,reject)=>{
    
            UserRoleRelation.update(whereObj,updateObj).then(data=>{
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