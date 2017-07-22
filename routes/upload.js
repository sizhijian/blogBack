const express = require('express'),
  router = express.Router(),
  usersSchema = require('../models/users'),
  mongoose = require('mongoose'),
  dbUrl = require('../config/db.conf'),
  co = require('co'),
  OSS = require('ali-oss');

mongoose.connect(dbUrl.url, {
  useMongoClient: true
});
var User = mongoose.model('users', usersSchema); //将模式编译到模型中model('集合名称',...)会变成全小写

var client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAILIHaDNxGfbU8',
  accessKeySecret: 'wLBmURLX1Ma3PlHOnW374uU4LL4fFC',
  bucket: 'sizhijian'
});

router.options('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.end();
});

/* POST users listing. */
router.post('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  var returnInfo = {
    state: 0,
    info: ""
  };
  // console.log(req.body.username)
  let base64Data = req.body.imageURL.replace(/^data:image\/\w+;base64,/, ""),
    dataBuffer = new Buffer(base64Data, 'base64');
  co(function*() {
    var result = yield client.put(req.body.username + ".png", dataBuffer);
    console.log(result);
    if (result.res.status === 200) {
      console.log("图片上传到阿里云成功🤔")
      User.findOne({
        username: req.body.username
      }, function(err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        if (doc) {
          doc.avatarUrl = result.url + "?" + Math.random();
          doc.save(function(err) {
            if (err) {
              console.log(err)
              returnInfo.info = '头像上传失败😞';
              res.send(returnInfo)
              return;
            }
            console.log('头像上传成功🤔')
            returnInfo.state = 1;
            returnInfo.info = '头像上传成功🤔';
            res.send(returnInfo)
            return;
          })
        }
      });
    } else {
      console.log("图片上传到阿里云失败😞")
    }
  }).catch(function(err) {
    console.log(err);
    returnInfo.info = '头像上传失败😞';
    res.send(err);
    return;
  });
});

module.exports = router;
