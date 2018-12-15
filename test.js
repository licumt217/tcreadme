let  redis=require('redis')
let client=redis.createClient(6379,'47.92.74.29',{})


client.auth('123456',function (err) {
    console.log(11)
})
client.on('ready',function (err) {
    console.log('ready')
})