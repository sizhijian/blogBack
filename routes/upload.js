var express = require('express'),
    router = express.Router(),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf'),
    multiparty = require('multiparty'),
    util = require('util'),
    fs = require('fs')

mongoose.connect(dbUrl.url);

var User = mongoose.model('users',usersSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.post('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: 0,
	    info:""
    };
    var form = new multiparty.Form();//生成multiparty对象，并配置上传目标路径
    form.on('error', function(err) {
      console.log('Error parsing form: ' + err.stack);
    });
    form.uploadDir = __dirname + "/../public/files/";//设置文件存储路径
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
            var username = fields.username[0];

        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files['file'][0];
            //重命名为真实文件名
            fs.rename(
              inputFile.path,
              form.uploadDir + "/"+ inputFile.originalFilename,
              function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    console.log(username)
                    User.findOne({username: username}, function(err, doc){
                      if(err){
                        console.log(err);
                        return;
                      }
                      if (doc) {
                        // doc.avatarUrl = 'http://192.168.1.68:3000/files/' + inputFile.originalFilename;
                        doc.avatarUrl = 'http://sizhijian.com:3000/files/' + inputFile.originalFilename;
                        doc.save(function(err){
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
                    })
                }
            });
        }
        // res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
        // res.write('received upload:\n\n');
        // res.end(util.inspect({fields: fields, files: filesTmp}));
    });
});

module.exports = router;
