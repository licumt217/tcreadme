const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let Resource=require('../dao/model/resource')


function add(parent,resource,res) {
//先判断是否有根节点，没有的话先创建
    Resource.find(parent).then(data=>{
        
        if(data && data.length>0){
            let p=data[0]
            let childs=p['children']
            childs.push(resource)
            //找到children再更新
            
            logger.info(56666666666)
            logger.info(childs)
            //add
            p.update({
                "children":childs
            },data=>{
                logger.info('fffffffff',data)
            })
            res.send(Response.success());


        }else{
            logger.info("未找到父级资源！")
            res.send(Response.businessException('未找到父级资源'));
        }
    }).catch(err=>{
        logger.info(err)
        res.send(Response.systemException())
    })
}

// 新增
router.post('/add', function (req, res) {
    
    logger.info("新增资源参数：",req.body)
    
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
            res.send(Response.businessException("已存在！"))
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