const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let User=require('../../dao/model/user')

let errorMsg="";

let UserDao={
    save(user){
        return new Promise((resolve,reject)=>{
            if(user){
                user.save().then(data=>{
                    resolve(data);
                }).catch(err=>{
                    errorMsg="新增用户异常！"
                    logger.info(errorMsg,err)
                    reject(errorMsg)
                })
            }else{
                errorMsg="新增用户不能为空！"
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
            User.find(whereObj).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg="根据条件查询用户异常！"
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    },
    
    
    
    
    

    
    
    
}






module.exports = UserDao