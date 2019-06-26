const mongoose = require('mongoose')
const Schema = mongoose.Schema

articalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  author: { type: String },
  content: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
})

module.exports = Artical = mongoose.model('articals', articalSchema)