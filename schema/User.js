const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  uid: {type: String, required: true, index: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: String, default: Date.now() }
})

// 自定义查询方法
userSchema.statics = {
  getUsers: function(params, cb) {
    return this.find()
    .exec(cb)
  }
}

module.exports = User = mongoose.model("users", userSchema)