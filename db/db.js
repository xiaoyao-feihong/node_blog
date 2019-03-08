// 引入mysql模块
const mysql = require('mysql')

// 创建连接
const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'heros',
    // 开启执行多条SQL语句的功能
    multipleStatements: true
})

module.exports = connect