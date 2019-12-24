module.exports = {
  // mongodbURI: 'mongodb://admin:852099@localhost/admin', // 本地连接
  mongodbURI: 'mongodb+srv://admin:852099@cluster0-o4csh.mongodb.net/test?retryWrites=true&w=majority', // mongoclub 的连接
  secretOrKey: 'secret',
  /**
   * 以下两串字符七牛的图片上传的密钥
   */
  QiniuAccessKey: 'e8fm5YosJAitFX7r1uURc8z5MmgykTJLild0xXq0',
  QiniuSecretKey: '04QiFHbctriGQNiJRbsWjmftI1GaGEksba4MnH9I'
}