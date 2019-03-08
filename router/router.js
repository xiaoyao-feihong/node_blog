const express = require('express')

const router = express.Router()

const controller = require('../controller/controller.js')

router.get('/', controller.getPage)

// 注册页面
router.get('/register', controller.getRegisterPage)

// 登录页面
router.get('/login', controller.getLoginPage)

// 登录判断的逻辑
router.post('/login', controller.loginJudge)

// 注册新用户
router.post('/register', controller.registerJudge)

router.get('/withdraw',controller.withdraw)

module.exports = router