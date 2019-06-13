const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRouter = require('./router/api/user')
const { mongodbURI } = require('./config/config')

const app = express()
mongoose.connect(mongodbURI)
mongoose.connection.once('open', (res) => {
  console.log('数据库成功连接！')
});
/**
 * bodyParser中间件 的注册一定要放在 路由（router）中间件的注册之前
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/admin/api/', userRouter)

/**
 * app监听5000端口
 */
app.listen(5000, (res) => {
  console.log('server run in port 5000')
})