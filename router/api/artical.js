const express = require('express')
const router = express.Router()
const Artical = require('../../schema/Artical')
const passport = require('passport')

router.get('/getArticals', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user.id
  Artical.find({ userId: userId }).then((resp) => {
    res.json({
      message: '查询成功',
      success: true,
      data: resp
    })
  })
})

router.post('/addArtical', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user.id
  const { title, author, content } = req.body
  let newArtical = new Artical({
    userId: userId,
    title: title,
    author: author,
    content: content
  })
  newArtical.save().then((product) => {
    res.json({
      success: true,
      data: product,
      message: '添加文章成功！'
    })
  })
  // console.log(req.user)
})

module.exports = router