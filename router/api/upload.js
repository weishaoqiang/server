const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/config')
const fs = require('fs')

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

function getUrlByKey(key) {
  var mac = new qiniu.auth.digest.Mac(keys.QiniuAccessKey, keys.QiniuSecretKey)
  var config = new qiniu.conf.Config()
  var bucketManager = new qiniu.rs.BucketManager(mac, config)
  var publicBucketDomain = 'ptstgqq0l.bkt.clouddn.com'
  // 公开空间访问链接
  return bucketManager.publicDownloadUrl(publicBucketDomain, key)
}
/**
 * 上传接口
 */
router.put('/uploadFile', (req, res) => {
  var imgData = req.body.file
  var fileName = Date.now() + '.png'
  var filePath = './test/' + fileName
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
  var dataBuffer = new Buffer(base64Data, 'base64')
  let uploadToken = getUploadToken({ expires: 7200, callbackBody: 'application/json' })
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z0
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  fs.writeFile(filePath, dataBuffer, function (err) {
    if (err) {
      res.end(JSON.stringify({ status: '102', msg: '文件写入失败', errer: err }));
    } else {
      const localFile  = filePath
      // 文件上传
      formUploader.putFile(uploadToken, fileName, localFile , putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          const url = getUrlByKey(respBody.key)
          res.json({
            success: true,
            data: {
              key: respBody.key,
              url: url
            }
          })
        } else {
          console.log(respInfo.statusCode)
          console.log(respBody)
        }
        fs.unlinkSync(filePath)
      })
    }
  })
})

module.exports = router