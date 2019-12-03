const express = require('express')
const router = express.Router()
const User = require('../../schema/User')
const Artical = require('../../schema/Artical')
const crypto = require("crypto") // node加密包
const uuid = require('uuid/v1') // uid生成器,根据时间戳
const jwt = require('jsonwebtoken')
const passport = require('passport')
// 创建路由
/**
 * 注册用户
 */
router.post('/register', (req, res) => {
  try {
    if (!req.body.email) {
      return res.json({ success: false, message: '邮箱不能为空！' })
    }
    if (!req.body.password) {
      return res.json({ success: false, message: '密码不能为空！' })
    }
    User.findOne({ email: req.body.email }).then(user => {
      if (user) return res.json({ success: false, message: '该邮箱已经被注册！' })
      // 如果没有注册过，将密码进行加密，然后存入数据库中
      const password = crypto.createHash('md5').update(req.body.password).digest('hex')
      let newUser = new User({
        uid: uuid(), // 使用uuid/v1生成
        email: req.body.email,
        password: password
      })
      newUser.save().then(function (product) {
        return res.json({ success: true, message: '注册成功,请登录！' })
      }).catch(err => {
        return res.json({ success: false, message: '注册失败', data: err })
      })
    }).catch(err => {
      return res.json({ success: false, message: err })
    })
  } catch(err) {
    return res.json({ success: false, message: err })
  }
})
/**
 * 用户登录
 */
router.post('/login', (req, res) => {
  try {
    if (!req.body.email) {
      return res.json({ success: false, message: '登陆邮箱不能为空！' })
    }
    if (!req.body.password) {
      return res.json({ success: false, message: '密码不能为空！' })
    }
    User.findOne({ email: req.body.email }).then((user) => {
      console.log(user)
      if (!user) {
        return res.json({ success: false, message: '用户不存在！' })
      }
      if (crypto.createHash('md5').update(req.body.password).digest('hex') === user.password) {
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
  } catch (err) {
    return res.json({ success: false, message: err })
  }
})

/**
 * token验证
 * 接口类型 private,获取客户信息
 */
router.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const user = req.user
    res.json({
      success: true,
      data: {
        name: user.name || null,
        uid: user.uid,
        email: user.email,
      },
      message: '查询成功！'
    })
  } catch (err) {
    return res.json({
      success: false,
      message: err
    })
  }
})

router.get('/getUsers', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    console.log(uuid())
    User.find().then(users => {
      users = users.map(ele => {
        const {name = '', email, uid} = ele
        return { name, email, uid }
      })
      res.json({ success: true, data: users })
    }).catch(err => {
      return res.json({ success: false, message: err })
    })
  } catch (err) {
    return res.json({ success: false, message: err })
  }
})

module.exports = router