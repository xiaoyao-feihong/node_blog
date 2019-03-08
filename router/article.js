
const express = require('express')

const router = express.Router()

const articleController = require('../controller/articleController.js')

// 监听文章添加页面的请求,返回文章添加页面
router.get('/article/add', articleController.getArticlePage)

// 监听文章添加页面的提交
router.post('/article/add',articleController.addArticle)

// 监听显示文章详情页面
router.get('/article/article_info',articleController.showInfo)

// 监听文章请求编辑页面，并返回编辑页面
router.get('/article/edit/:id',articleController.editArticle)

router.post('/article/edit',articleController.saveEditDetail)

// 监听删除文章的请求
router.get('/article/delete/:id',articleController.deleteArticle)

// 获取文章详情页面
router.get('/article/browseArticle/:id',articleController.browseArticle)

module.exports = router