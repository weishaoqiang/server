const express = require('express')
const router = express.Router()
const Artical = require('../../schema/Artical')
const passport = require('passport')

router.get('/getArticals', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.user.uid
  console.log(userId)
  // Artical.find({ userId: userId }).then((resp) => {
  //   if (!resp) {
  //     return res.json({ success: false, message: '查询失败' })
  //   }
  //   res.json({
  //     message: '查询成功',
  //     success: true,
  //     data: resp
  //   })
  // })
  Artical.getArticals({id: ''}, function(err, data) {
    if(err) return res.json({ success: false, message: err })
    return res.json({ success: true, data: data})
    // if (err) return res.json({ success: false, message: '试试这个方法' })
    // return res.json({ success: true, message: '试试这个方法' })
  })
})

router.post('/addArtical', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const userId = req.user.uid
    const { title, author, content } = req.body
    console.log(req.body)
    if (!title) {
      return res.json({
        success: false,
        message: '文章标题不能为空'
      })
    }
    if (!author) {
      return res.json({
        success: false,
        message: '作者姓名不能为空'
      })
    }
    if (!content) {
      return res.json({
        success: false,
        message: '内容不能为空'
      })
    }
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
    }).catch(err => {
      return res.json({ success: false, message: err.message})
    })
  } catch (err) {
    return res.json({ success: false, message: err })  
  }
})

module.exports = router