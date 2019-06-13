const express = require('express')
const router = express.Router()
const User = require('../../schema/User')

// 创建路由
/**
 * 注册用户
 */
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) return res.json({ success: true, message: '该邮箱已经被注册！' })
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    newUser.save().then(function (product) {
      return res.json({ success: true, message: '注册成功,请登录！' })
    })
  }).catch(err => {
    return res.json({ success: false, message: '注册失败', data: res })
  })
})
/**
 * 用户登录
 */
router.post('/login', (req, res) => {

})

module.exports = router