const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let Resource=require('../../dao/model/resource')
const entityName="资源";
let errorMsg="";

let ResourceDao={
    save(resource){
        return new Promise((resolve,reject)=>{
            if(resource){
                resource.save().then(data=>{
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
            Resource.find(whereObj).then(data=>{
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
    
            Resource.remove({
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
    
            Resource.update(whereObj,updateObj).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg=`修改${entityName}信息异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    }
    
    
    
    
    

    
    
    
}






module.exports = ResourceDao