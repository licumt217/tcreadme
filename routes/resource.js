const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
const Response=require('../config/response')
let Resource=require('../dao/model/resource')
let ResourceDao=require('../dao/dao/ResourceDao')
let RoleResourceRelationDao=require('../dao/dao/RoleResourceRelationDao')
const entityName='资源'


// 新增
router.post('/add', function (req, res) {
    
    logger.info(`新增${entityName}参数：`,req.body)
    
    ResourceDao.autoGetCode(req.body.parentCode).then(code=>{
        return Promise.resolve(code)
    }).then(data=>{
        req.body.code=data
        //先判断是否有根节点，没有的话先创建
        let whereObj={
            $or : [ //多条件，数组
                {name : req.body.name},
                {url :req.body.url},
                {code :req.body.code}
            ]
        };
        return ResourceDao.find(whereObj).then(data=>{
            if(data && data.length>0){
                return Promise.reject(`${entityName}已存在！`)
            }else{
                return Promise.resolve();
            }
        })
    }).then(()=>{
        let resource = new Resource(req.body);
        return ResourceDao.save(resource).then(data=>{
            res.send(Response.success(data))
        
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err));
    })
    
})


// 删除
router.post('/remove', function (req, res) {
    
    logger.info(`删除${entityName}参数：`,req.body)
    
    let id=req.body.id
    
    //只有此资源没有被角色关联才可以删除，同时此资源必须没有下级才能删除
    
    RoleResourceRelationDao.find({
        resourceId:id
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject("此资源已被角色授权，请先解除关系")
        }else{
            return Promise.resolve();
            
        }
    }).then(data=>{
        ResourceDao.find({
            _id:id
        }).then(data=>{
            return Promise.resolve(data)
        })
    }).then(data=>{
        ResourceDao.find({
            parentCode:data.code
        }).then(data=>{
            if(data && data.length>0){
                return Promise.reject("请先删除此资源的下级资源")
            }else{
                return ResourceDao.remove(id)
            }
        })
    }).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        err=typeof err==='object'?"删除资源异常":err
        res.send(Response.businessException(err));
    })
    
    .catch(err=>{
        logger.info(err)
        err=typeof err==='object'?"删除资源异常":err
        res.send(Response.businessException(err));
    })
})

// 修改资源信息
router.post('/update', function (req, res) {
    
    logger.info(`修改${entityName}信息参数：`,req.body)
    
    let whereObj={
        _id:req.body._id,
    };
    
    ResourceDao.find(whereObj).then(data=>{
        
        if(data && data.length>0){
            
            return Promise.resolve()
            
        }else{
            
            res.send(Response.businessException(`未找到对应${entityName}"`))
        }
    }).then(()=>{
        
        let updateObj=JSON.parse(JSON.stringify(req.body));
    
        ResourceDao.update(whereObj,updateObj).then(data=>{
            res.send(Response.success());
        }).catch(err=>{
            res.send(Response.businessException(err))
        })
    }).catch(err=>{
        logger.info(err)
        err=typeof err==='object'?"更新资源异常":err
        res.send(Response.businessException(err))
    })
})

router.post('/list', function (req, res) {
    
    logger.info(`list${entityName}参数：`,req.body)
    
    ResourceDao.find().then(data=>{
        
        res.send(Response.success(data))
    }).catch(err=>{
        logger.info(err)
        err=typeof err==='object'?"查询资源列表异常":err
        res.send(Response.businessException(err))
    })
})

router.post('/listByLevel', function (req, res) {
    
    logger.info(`listByLevel${entityName}参数：`,req.body)
    
    ResourceDao.findWithLevel().then(data=>{
        
        res.send(Response.success(data))
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})
router.post('/getParentResources', function (req, res) {
    
    logger.info(`getParentResources${entityName}参数：`,req.body)
    
    ResourceDao.find({
        parentCode:'0000'
    }).then(data=>{
        
        res.send(Response.success(data))
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})









module.exports = router