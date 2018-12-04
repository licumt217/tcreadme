const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
const utils=require('../assets/utils')
let Resource=require('../dao/model/resource')



// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增资源参数：",req.body)
    
    if(!req.body.parentCode){
        req.body.parentCode='0000'
    }
    
    autoGetCode(req.body.parentCode).then(code=>{
        req.body.code=code
        let resource = new Resource(req.body);
        //先判断是否有根节点，没有的话先创建
        Resource.find({
            $or : [ //多条件，数组
                {name : req.body.name},
                {url :req.body.url},
                {code :req.body.code}
            ]
        }).then(data=>{
        
            if(data && data.length>0){
                res.send(Response.businessException("资源已存在！"))
            }else{
                resource.save().then(data=>{
                    res.send(Response.success(data))
                
                }).catch(data=>{
                    logger.info("新增资源异常！",data)
                    res.send(Response.systemException());
                })
            }
        }).catch(err=>{
            logger.info(err)
            res.send(Response.systemException())
        })
    })
    
})

router.post('/list', function (req, res) {
    
    logger.info("list资源参数：",req.body)
    
    let resource = new Resource(req.body);
    
    //先判断是否有根节点，没有的话先创建
    Resource.find().then(data=>{
        logger.info('...................')
        logger.info(data)
        res.send(Response.success(data))
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
    
    
    
    
})





// -------------------------------------------------------------------------
// 本路由工具方法

/**
 * 根据父节点的code自动生成子集资源的code，按顺序+1
 * @param parentCode
 * @returns {Promise}
 */
function autoGetCode(parentCode) {
    
    return new Promise(function(resove,reject){
        //先判断此父节点下是否有子元素，没有的话
        Resource.find({
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
                resove(parentCode+'0001')
            }
            
        }).catch(err=>{
            logger.info(err)
            reject(Response.systemException())
        })
    })
    
    
}






module.exports = router