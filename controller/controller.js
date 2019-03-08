
// 不需要引入，因为server.js已经引入了框架
// const express = require('express')

const connect = require('../db/db.js')

const moment = require('moment')

// 导入加密模块
const bcrypt = require('bcrypt')
// 加密循环幂次
const saltRounds = 10

// 获取首页
const getPage = (req, res) => {
    // 只有配置了模板引擎，才能使用res.render()方法
    // 联动查询前，必须开启数据库的multipleStatemens:true，具备执行多条语句的功能
    const itemPerPage = 8
    // 当前页面数量
    const nowPage = Number(req.query.page) || 1
    // 注意查询语句要用模板字符串，否则报错1337,undeclared variable: $
    const sql = `select blog_articles.id,blog_articles.title,blog_articles.ctime,blog.nickname from blog_articles\
    LEFT JOIN blog ON blog_articles.authorid=blog.id ORDER BY blog_articles.ctime desc limit ${(nowPage - 1) * itemPerPage},${itemPerPage};\
    select count(*) as count from blog_articles`;
    connect.query(sql, (err, result) => {
        if (err) {
            return res.render('index.ejs', {
                user: req.session.user,
                islogin: req.session.islogin,
                articles: []
            })
        } else {
            // 文章总数量
            const articlesCount = result[1][0].count
            // 分页数目
            const pageCount = Math.ceil(articlesCount / itemPerPage)
            // 渲染文章数组
            // 这样每次都获取了大量数据，浪费效率
            // const articleArr = result[0].splice(((nowPage - 1)*8),8)
            return res.render('index.ejs', {
                user: req.session.user,
                islogin: req.session.islogin,
                articles: result[0],
                pageCount,
                nowPage
            })
        }
    })

}

// 获取注册页面
const getRegisterPage = (req, res) => {
    res.render('./user/register.ejs', {})
}

// 获取登录页面
const getLoginPage = (req, res) => {
    res.render('./user/login.ejs', {})
}

// 登录判断的逻辑
const loginJudge = (req, res) => {
    // 获取表单数据
    const loginKey = req.body
    const sql = 'select * from blog where username=?'
    connect.query(sql, loginKey.username, (err, result) => {
        // 查询出错
        if (err) return res.send({ status: 500, msg: '查询出现错误', data: null })
        // 没查询到用户名，检查nickname
        if (result.length !== 1) {
            const sql2 = 'select * from blog where nickname=?'
            connect.query(sql2, loginKey.username, (err, result) => {
                if (err) return res.send({ status: 500, msg: '查询出现错误', data: null })
                if (result.length !== 1) return res.send({ status: 502, msg: '用户信息不存在，请重新核对', data: null })
                // 比对用户输入密码与数据库密码
                bcrypt.compare(loginKey.password, result[0].password, (err, compareResult) => {
                    if (err) return res.send({ status: 500, msg: '查询出现错误', data: null })
                    if (!compareResult) return res.send({ status: 500, msg: '请核对密码', data: null })
                    // 把用户登录成功的信息，挂载到session上
                    req.session.user = result[0]
                    req.session.islogin = true
                    res.send({ status: 200, msg: '登录成功', data: null })
                })
            })
        } else {
            bcrypt.compare(loginKey.password, result[0].password, (err, compareResult) => {
                if (err) return res.send({ status: 500, msg: '查询出现错误', data: null })
                if (!compareResult) return res.send({ status: 500, msg: '请核对密码', data: null })
                // 把用户登录成功的信息，挂载到session上
                req.session.user = result[0]
                req.session.islogin = true
                res.send({ status: 200, msg: '登录成功', data: null })
            })}
    })
}

// 注册新用户
const registerJudge = (req, res) => {
    // 获取用户提交表单数据
    const userInfo = req.body
    // 查询昵称是否重复
    const sql2 = 'select count(*) as count from blog where nickname=?'
    connect.query(sql2, userInfo.nickname, (err, result) => {
        if (err) return res.send({ status: 502, msg: err.message, data: null })
        if (result[0].count !== 0) return res.send({ status: 502, msg: '昵称已存在', data: null })
        // 查询用户名是否重复
        const sql1 = 'select count(*) as count from blog where username=?'
        connect.query(sql1, userInfo.username, (err, result) => {
            if (err) return res.send({ status: 502, msg: err.message, data: null })
            if (result[0].count !== 0) return res.send({ status: 502, msg: '用户名已存在', data: null })
            // 新建用户账号
            // 密码加密方法
            bcrypt.hash(userInfo.password, saltRounds, (err, pwd) => {
                if (err) return res.send({ status: 500, msg: '服务器异常,注册失败', data: null })
                const sql3 = 'insert into blog set ?'
                // 保存加密后的密码
                userInfo.password = pwd
                // 创建用户的注册时间
                userInfo.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
                connect.query(sql3, userInfo, (err, result) => {
                    if (err) return res.send({ status: 500, msg: '注册用户失败', data: null })
                    res.send({ status: 200, msg: '创建成功', data: null })
                })
            })
        })
    })
}

// 注销用户逻辑
const withdraw = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


const controller = {
    getPage,
    getRegisterPage,
    getLoginPage,
    loginJudge,
    registerJudge,
    withdraw
}

module.exports = controller