const express = require('express')
const router = express.Router()
const User = require('../../schema/User')
const md5 = require("crypto").createHash('md5')
const jwt = require('jsonwebtoken')
const passport = require('passport')
// 创建路由
/**
 * 注册用户
 */
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) return res.json({ success: true, message: '该邮箱已经被注册！' })
    // 如果没有注册过，将密码进行加密，然后存入数据库中
    const password = md5.update(req.body.password).digest('hex')
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: password
    })
    newUser.save().then(function (product) {
      return res.json({ success: true, message: '注册成功,请登录！' })
    }).catch(err => {
      return res.json({ success: false, message: '注册失败', data: err })
    })
  })
})
/**
 * 用户登录
 */
router.post('/login', (req, res) => {
  if (!req.body.email) {
    return res.json({ success: false, message: '登陆邮箱不能为空！' })
  }
  if (!req.body.password) {
    return res.json({ success: false, message: '密码不能为空！' })
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.json({ success: false, message: '用户不存在！' })
    }
    if (md5.update(req.body.password).digest('hex') === user.password) {
      const rule = {
        id: user.id
      }
      jwt.sign(rule, 'secret', { expiresIn: 60 * 60 * 24 }, (err, token) => {
        if (err) throw err
        return res.json({
          success: true,
          data: {
            token: 'Bearer ' + token
          },
          message: '登陆成功！'
        })
      })
    } else {
      return res.json({ success: false, message: '输入密码不正确' })
    }
  })
})
/**
 * token验证
 * 接口类型 private
 */
router.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      success: true,
      data: {
        name: req.user.name,
        email: req.user.email,
      },
      message: '查询成功！'
    })
})

module.exports = router