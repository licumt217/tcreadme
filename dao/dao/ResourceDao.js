const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const utils=require('../../assets/utils')
let Resource=require('../../dao/model/resource')
let mongoose=require('mongoose')
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
            Resource.find(whereObj).sort({'sequence':1}).then(data=>{
                resolve(data)
            }).catch(err=>{
                errorMsg=`根据条件查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
            
        })
    },
    findWithLevel(whereObj){
        return new Promise((resolve,reject)=>{
            
            if(!whereObj){
                whereObj={}
            }
            //升序
            Resource.find(whereObj).sort({'sequence':-1}).exec().then(data=>{
                //此句不可少，将mongoose对象转为纯js对象，否则添加属性添加不上
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
                resolve(firstLevel)
                
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
                _id:mongoose.Types.ObjectId(id)
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
    },
    /**
     * 根据父节点的code自动生成子集资源的code，按顺序+1
     * @param parentCode
     * @returns {Promise}
     */
    autoGetCode(parentCode){
        parentCode=parentCode||'0000'
        const firstChildCode='0001'
    
        return new Promise(function(resove,reject){
            //先判断此父节点下是否有子元素，没有的话
            ResourceDao.find({
                parentCode:parentCode
            }).then(data=>{
            
                if(data && data.length>0){
                    let codeArray=data.map(item=>{
                        return Number(item.code);
                    })
                
                    let originalLen=data[0].code.length;
                    let maxCode=String(Math.max.apply( Math, codeArray )+1);
                
                    resove(utils.fixZero(originalLen,maxCode))
                
                
                }else{
                    resove(parentCode+firstChildCode)
                }
            
            }).catch(err=>{
                logger.info(err)
                reject(err)
            })
        })
    }
    
    
    
    
    

    
    
    
}






module.exports = ResourceDao