let redis=require('redis')
const log4js= require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
logger.info('...........')
const password='123456'
const port=6379;
const host='47.92.74.29'

let client=redis.createClient(port,host,{})

client.auth(password,function (err) {
    if(err){
        logger.info('redis授权失败')
    }else{
        logger.info('redis授权成功')
    }
    
})
client.on('ready',function (err) {
    if(err){
        logger.info('redis准备失败')
    }else{
        logger.info('redis准备成功')
    }
})

let redisClent={
    set(key,value,expires){
        return new Promise((resolve,reject)=>{
            client.set(key,value,(err,response)=>{
                if(err){
                    logger.info('redis set error',err)
                    reject()
                }else{
                    //设置超时
                    if(expires){
                        client.expire(key,expires)
                    }
                    logger.info(`redis set success!key:${key},value:${value}`)
                    resolve();
                }
            })
        })
    },
    get(key){
        return new Promise((resolve,reject)=>{
            client.get(key,(err,response)=>{
                if(err){
                    logger.info('redis get error',err)
                    reject()
                }else{
                    logger.info(`redis get by key:${key},return value:${response}`)
                    resolve(response);
                }
            })
        })
    },
    hset(hashkey,key,value,expires){
        return new Promise((resolve,reject)=>{
            client.hset(hashkey,key,value,(err,response)=>{
                if(err){
                    logger.info('redis hset error',err)
                    reject()
                }else{
                    //设置超时
                    if(expires){
                        client.expire(hashkey,expires)
                    }
                    logger.info(`redis hset success!hashkey:${hashkey},key:${key},value:${value}`)
                    resolve();
                }
            })
        })
    },
    hmset(hashkey,...values){
        return new Promise((resolve,reject)=>{
            client.hmset(hashkey,...values,(err,response)=>{
                if(err){
                    logger.info('redis hmset error',err)
                    reject()
                }else{
                    logger.info(`redis hmset success!hashkey:${hashkey},values:${values}`)
                    resolve();
                }
            })
        })
    },
    hget(hashkey,key){
        return new Promise((resolve,reject)=>{
            client.hget(hashkey,key,(err,response)=>{
                if(err){
                    logger.info('redis hget error',err)
                    reject()
                }else{
                    logger.info(`redis hget success!hashkey:${hashkey},key:${key},value:${response}`)
                    resolve(response);
                }
            })
        })
    },
    hgetall(hashkey){
        return new Promise((resolve,reject)=>{
            client.hgetall(hashkey,(err,response)=>{
                if(err){
                    logger.info('redis hgetall error',err)
                    reject()
                }else{
                    logger.info(`redis hgetall success!hashkey:${hashkey},value:${response}`)
                    resolve(response);
                }
            })
        })
    },
    hkeys(hashkey){
        return new Promise((resolve,reject)=>{
            client.hkeys(hashkey,(err,response)=>{
                if(err){
                    logger.info('redis hkeys error',err)
                    reject()
                }else{
                    logger.info(`redis hkeys success!hashkey:${hashkey},value:${response}`)
                    resolve(response);
                }
            })
        })
    },
    del(key){
        return new Promise((resolve,reject)=>{
            client.del(key,(err,response)=>{
                if(err){
                    logger.info('redis del key:${key} error',err)
                    reject()
                }else{
                    logger.info(`redis del key:${key} success,value:${response}`)
                    resolve(response);
                }
            })
        })
    }
}

module.exports=redisClent;