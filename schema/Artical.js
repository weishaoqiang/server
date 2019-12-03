const mongoose = require('mongoose')
const Schema = mongoose.Schema

articalSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
})

articalSchema.statics = {
  getArticals(params, cb) {
    const {id, pageSize = 3, curPage = 1} = params
    if (id) {
      return this.find({ userId: id })
        .skip(pageSize * (curPage - 1))
        .limit(pageSize)
        .sort({ 'createDate': 1 })
        .exec(cb)
    } else {
      return this.find({})
        .skip(pageSize * (curPage - 1))
        .limit(pageSize)
        .sort({ 'createDate': 1 })
        .exec(cb)
    }
  }
}

module.exports = Artical = mongoose.model('articals', articalSchema)