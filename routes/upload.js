var express = require('express'),
  router = express.Router(),
  usersSchema = require('../models/users'),
  mongoose = require('mongoose'),
  dbUrl = require('../config/db.conf'),
  multiparty = require('multiparty'),
  util = require('util'),
  images = require('images'),
  path = require('path'),
  fs = require('fs');

mongoose.connect(dbUrl.url, {
  useMongoClient: true
});
var User = mongoose.model('users', usersSchema); //将模式编译到模型中model('集合名称',...)会变成全小写

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
  fs.writeFile(path.join(__dirname, "./../public/files/") + req.body.username + ".png", dataBuffer, function(err) {
    if (err) {
      console.log(err)
      returnInfo.info = '头像上传失败';
      res.send(err);
      return;
    } else {
      console.log("图片写入本地成功🤔")
      User.findOne({
        username: req.body.username
      }, function(err, doc) {
        if (err) {
          console.log(err);
          return;
        }
        if (doc) {
          // doc.avatarUrl = 'http://192.168.1.91:3000/files/' + req.body.username + ".png?" + Math.random();
          doc.avatarUrl = 'http://sizhijian.com:3000/files/' + req.body.username + ".png" + Math.random();
          doc.save(function(err) {
            if (err) {
              console.log(err)
              returnInfo.info = '头像上传失败😞';
              res.send(returnInfo)
              return;
            }
            console.log('头像上传成功🤔')
            returnInfo.state = 1;
            returnInfo.info = '头像上传成功';
            res.send(returnInfo)
            return;
          })
        }
      });
    }
  });

  // res.send(returnInfo);
  return;
  var form = new multiparty.Form(); //生成multiparty对象，并配置上传目标路径
  form.on('error', function(err) {
    console.log('Error parsing form: ' + err.stack);
    return;
  });
  form.uploadDir = __dirname + "./../public/files/"; //设置文件存储路径
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log('parse error: ' + err);
    } else {
      var inputFile = files['file'][0];
      // console.log(files.file[0].path);
      var filesTmp = JSON.stringify(files, null, 2);
      var username = fields.username[0];
      let imagesObj = images(files.file[0].path);
      let imagesSize = 400;
      if (imagesObj.width() > imagesObj.height() && imagesObj.width() > imagesSize) {
        imagesObj.resize(imagesSize, null);
      } else if (imagesObj.width() < imagesObj.height() && imagesObj.height() > imagesSize) {
        imagesObj.width(imagesSize * (imagesObj.width() / imagesObj.height()))
          .height(imagesSize);
      }
      imagesObj
        .saveAsync(__dirname + "/../public/files/" + files['file'][0].originalFilename,
          function() {
            console.log('rename ok');
            console.log(username);
            fs.unlink(files.file[0].path, function() {
              console.log("源文件删除成功")
            })
            User.findOne({
              username: username
            }, function(err, doc) {
              if (err) {
                console.log(err);
                return;
              }
              if (doc) {
                // doc.avatarUrl = 'http://192.168.1.91:3000/files/' + inputFile.originalFilename;
                doc.avatarUrl = 'http://sizhijian.com:3000/files/' + inputFile.originalFilename;
                doc.save(function(err) {
                  if (err) {
                    console.log(err)
                    returnInfo.info = '头像上传失败';
                    res.send(returnInfo)
                    return;
                  }
                  console.log('头像上传成功')
                  returnInfo.state = 1;
                  returnInfo.info = '头像上传成功';
                  res.send(returnInfo)
                  return;
                })
              }
            });
          });
    }
    // res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
    // res.write('received upload:\n\n');
    // res.end(util.inspect({fields: fields, files: filesTmp}));
  });
});

module.exports = router;
