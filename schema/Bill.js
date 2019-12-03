const mongoose = require('mongoose')
const Schema = mongoose.Schema


const billSchema = new Schema({
  billId: { type: String, required: true  }, // 账单Id
  userId: { type: String, required: true }, // 使用userId做索引
  createDate: { type: String, default: Date.now() },
  recordDate: { type: String, default: '' }, // 记录日期，就是产生账单的日期
  bilpayMoney: { type: Number, default: 0 , required: true},
  billState: { type: Number, default: 1, required: true }, // 1:未结算、2:已结算
  billName: { type: String, default: '' }, // 账单名称
  remark: { type: String, default: '' } // 账单备注
})

module.exports = Bill = mongoose.model("bills", billSchema)