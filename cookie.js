const http = require('http')

const server = http.createServer()

server.on('request',(req,res) => {
    const cookie = req.headers.cookie
    const cookieObj = {}
    cookie && cookie.split(';').forEach(item => {
        const partial = item.split('=')
        cookieObj[partial[0]] = partial[1]
    })
    // console.log(cookieObj)
    if(cookieObj.isvisit == 'yes'){
        res.writeHeader(200,{
            'Content-Type': 'text/plain;charset=utf-8',
            // 'Set-Cookie': ['isvisit=yes','test=ok']
     })
        res.end('欢迎再次登录')
    }else{
        const expiresTime = new Date(Date.now() + 10*1000).toUTCString()
        res.writeHeader(200,{
            'Content-Type': 'text/plain;charset=utf-8',
            'Set-Cookie': ['isvisit=yes;expires=' + expiresTime,'test=ok']
     })
        res.end('第一次登陆，奖励一朵小红花')
    }
   
})

server.listen(5000,() => {
    console.log('server running at http://127.0.0.1:5000')
})