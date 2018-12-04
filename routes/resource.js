const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let Resource=require('../dao/model/resource')

function fixCode(num) {
    let zeroNum=4-num.length;
    let returnStr=''
    for(let i=0;i<zeroNum;i++){
        returnStr+='0'
    }
    return returnStr+num;
    
    
}
function autoGetCode(parentCode) {
    
    
    
    return new Promise(function(resove,reject){
        //先判断是否有根节点，没有的话先创建
        Resource.find({
            parentCode:parentCode
        }).then(data=>{
        
            if(data && data.length>0){
                let codeArray=data.map(item=>{
                    return Number(item.code);
                })
                let maxCode=String(Math.max.apply( Math, codeArray )+1);
            
                resove(fixCode(maxCode))
            
            
            }else{
                resove(parentCode+'0001')
            }
        
        }).catch(err=>{
            logger.info(err)
            reject(Response.systemException())
        })
    })
    
    
}

// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增资源参数：",req.body)
    let parentCode=req.body.parentCode;
    if(!parentCode){
        req.body.parentCode='0000'
    }
    
    
    let resource = new Resource(req.body);
    
    
    autoGetCode(parentCode).then(code=>{
        req.body.code=code
    })
    
    
    
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












module.exports = router