const express = require('express')
const router = express.Router()
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const Response=require('../config/response')
const fs=require('fs')
const path=require('path')
let multer  = require('multer');
let upload = multer({dest:'uploads/'});
//
router.post('/', upload.single('logo'),function (req, res) {
    let des_file = path.join(__dirname,"../uploads/" + req.file.originalname)  ;
    logger.info("要保存的文件名：",des_file)
    logger.info("已上传的文件名：",req.file.path)
    fs.readFile( req.file.path, function (err, data) {
        if(err){
            logger.info(err)
            res.send(Response.businessException("上传文件失败！"))
        }else{
            fs.writeFile(des_file, data, function (err) {
                if( err ){
                    logger.info(err)
                    res.send(Response.businessException("将上传的文件写入磁盘失败！"))
                }else{
                    fs.unlink(req.file.path,function (err) {
                        if(err) {
                            logger.info("将上传的原文件删除失败！")
                        }else{
                            logger.info("将上传的原文件删除成功")
                        }
                    })
                    logger.info("将上传的文件写入磁盘成功！")
                    res.send(Response.success({
                        filename:des_file
                    }))
                }
            });
        }


    });
})

router.post('/png', upload.array('png',2),function (req, res) {
    let files=req.files

    for (let i = 0; i < files.length; i++) {
        let file=files[i]
        let des_file = path.join(__dirname,"../uploads/" + file.originalname)  ;
        // 图片会放在uploads目录并且没有后缀，需要自己转存，用到fs模块
        // 对临时文件转存，fs.rename(oldPath, newPath,callback);
        fs.rename(file.path, des_file, function(err) {
            if (err) {
                logger.info("保存文件"+des_file+"失败",err)
                res.send(Response.systemException("保存文件"+des_file+"失败"))
            }else{
                logger.info("保存文件"+des_file+"成功")
                fs.unlink(file.path,()=>{})
            }
        })
    }

    res.send(Response.success())


})



module.exports = router