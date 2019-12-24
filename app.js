const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { mongodbURI } = require('./config/config')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const userRouter = require('./router/api/user')
const articalRouter = require('./router/api/artical')

const app = express()
mongoose.set('useCreateIndex', true)
mongoose.connect(mongodbURI, { useNewUrlParser: true }, function(err) {
  if (err) {
    console.error(err)
  } else {
    console.log('connect success')
  }
})
mongoose.connection.once('open', (res) => {
  console.log('数据库成功连接！')
});

/**
 * 允许跨域访问服务
 */
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'); // 这一行为什么把Content-Type后面的内容去掉会访问不到呢？
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})

/**
 * bodyParser中间件 的注册一定要放在 路由（router）中间件的注册之前
 */
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use('/admin/api/', userRouter)
app.use('/admin/api/', articalRouter)
app.use(passport.initialize())
require('./config/passport')(passport)
/**
 * app监听5000端口
 */
app.listen(5000, '0.0.0.0', (res) => {
  console.log('server run in port 5000')
})