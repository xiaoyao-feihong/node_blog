
const con = require('../db/db-article.js')

const marked = require('marked')

const moment = require('moment')
// 获取编辑文章页面
const getArticlePage = (req, res) => {
    // 如果用户登录了，渲染页面，否则返回首页
    if (req.session.islogin) {
        res.render('../views/article/add.ejs', {
            user: req.session.user,
            islogin: req.session.islogin
        })
    } else {
        res.redirect('/')
    }
}

// 发表文章，将文章保存到数据库
const addArticle = (req, res) => {
    const info = req.body
    // authorid通过隐藏域传递进了body
    info.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = 'insert into blog_articles set ?'
    con.query(sql, info, (err, result) => {
        if (err) return res.send({ status: 500, msg: err.message, data: null })
        if (result.affectedRows !== 1) return res.send({ status: 502, msg: '文章添加失败', data: null })
        res.send({ status: 200, msg: '文章发表成功', data: null, insertId: result.insertId})
    })
}

// 显示个人所写文章详情页 
const showInfo = (req, res) => {
    // 获取authorid
    if(!req.session.user) return res.redirect('/')
    const id = req.session.user.id
    // 每页展示文章数量
    const itemPerPage = 8
    // 获取当前页面参数
    const nowPage = Number(req.query.page) || 1
    const sql = 'select * from blog_articles where authorid=?'
    con.query(sql, id, (err, result) => {
        if (err) return res.send({ status: 500, msg: '获取文章失败', data: null })
        result.forEach(item => {
            item.content = marked(item.content)
        })
        // 获取文章总数量
        const articlesCount = result.length
        // 页面展示数量
        const pageCount = Math.ceil(articlesCount / itemPerPage)
        // 渲染文章数组
        const articleArr = result.splice((nowPage-1)*8,8)
        res.render('./article/articleInfo.ejs', {
            user: req.session.user,
            islogin: req.session.islogin,
            // 传递所有的文章信息
            articles: articleArr,
            pageCount,
            nowPage
        })
    })
}

// 编辑页面
const editArticle = (req, res) => {
    const id = req.params.id
    const sql = 'select * from blog_articles where id=?'
    con.query(sql,id,(err,result) => {
        if(err) return res.send({status: 500,msg: '查找出现异常',data: null})
        res.render('./article/editArticlePage.ejs',{
            user: req.session.user,
            islogin: req.session.islogin,
            article: result[0],
            insertId: req.params.id
        })
    })
}

// 保存更改并返回个人文章页面
const saveEditDetail = (req,res) => {
    const body = req.body
    // console.log(req.session)
    // console.log(body)
    // body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = 'update blog_articles set title=?,content=? where id=?'
    con.query(sql,[body.title,body.content,body.id],(err,result) => {
        if(err) return res.send({status: 500,msg: '保存失败',data: null})
        res.send({status: 200,msg: '保存成功',data: null})
    })
}

// 删除用户文章
const deleteArticle = (req,res) => {
    const id = req.params.id
    const sql = 'delete from blog_articles where id=?'
    con.query(sql,id,(err,result) => {
        if(err) return res.redirect('/')
        if(result.affectedRows !== 1) return res.redirect('/')
        res.send({status: 200,msg: '删除成功!',data: null})
    })
}

// 文章详情页
const browseArticle = (req,res) => {
    const id = req.params.id
    const sql = 'select * from blog_articles where id=?'
    con.query(sql,id,(err,result) => {
        if(err) return res.redirect('/')
        result[0].content = marked(result[0].content)
        res.render('./article/browseArticle.ejs',{
            user: req.session.user,
            islogin: req.session.islogin,
            article: result[0]
        })
    })
}

module.exports = {
    getArticlePage,
    addArticle,
    showInfo,
    editArticle,
    saveEditDetail,
    deleteArticle,
    browseArticle
}