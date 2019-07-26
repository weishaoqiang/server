const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRouter = require('./router/api/user')
const articalRouter = require('./router/api/artical')
const uploadRouter = require('./router/api/upload')
const { mongodbURI } = require('./config/config')
const jwt = require('jsonwebtoken')
const passport = require('passport')

mongoose.connect(mongodbURI, { useNewUrlParser: true })
mongoose.connection.on('open', (err, res) => {
  if (err) throw err
  console.log('数据库成功连接！')
})

const app = express()
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
/**
 * bodyParser中间件 的注册一定要放在 路由（router）中间件的注册之前
 */
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use('/admin/api/', userRouter)
app.use('/admin/api/', articalRouter)
app.use('/admin/api/', uploadRouter)
app.use(passport.initialize())
require('./config/passport')(passport)
/**
 * app监听5000端口
 */
app.listen(5000, (res) => {
  console.log('server run in port 5000')
})