const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/config')

const qiniu = require('qiniu')

function getUploadToken(params) {
  const mac = new qiniu.auth.digest.Mac(keys.QiniuAccessKey, keys.QiniuSecretKey)
  const options = {
    scope: 'weishaoqiang_qiniu',
    expires: params.expires || 3600,
    callbackBody: params.callbackBody
  };
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}
/**
 * 上传接口
 */
router.put('/uploadFile', (req, res) => {
  let uploadToken = getUploadToken({ expires: 7200, callbackBody: 'application/json' })
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z0
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  var readableStream = req.body.file // 可读的流
  var key = 'a.jpg'
  formUploader.putStream(uploadToken, key, readableStream, putExtra, function (respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
})

module.exports = router