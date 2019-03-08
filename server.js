
const express = require('express')

const app = express()

const router = require('./router/router.js')

const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
    extended: false
}))

const session = require('express-session')

const cookieParser = require('cookie-parser')

app.use(cookieParser())

app.use(session({
    secret: 'secret key',
    resave: false,
    cookie: {
        // 设置过期时间为1天
        maxAge: 3600000*24 
    },
    saveUninitialized: false
}))

//引入文章页面的路由
const articleRouter = require('./router/article.js')

// 配置模板引擎
app.set('view engine','ejs')

app.set('views','./views')

// 将node_modules文件夹下的文件设置成静态资源文件
app.use('/node_modules',express.static(__dirname + '/node_modules'))
app.use('/views',express.static(__dirname + '/views'))

// 使用路由中间件
app.use(router)
app.use(articleRouter)

app.listen(3000,() => {
    console.log('server running at http://127.0.0.1:3000')
})