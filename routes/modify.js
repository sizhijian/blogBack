var express = require('express'),
    router = express.Router(),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url, {useMongoClient:true});

var User = mongoose.model('users',usersSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

router.options('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.end();
});

/* GET users listing. */
router.post('/', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: null,
	    info:""
    };
    console.log(req.body);
    if (req.body.nickname == "") {
        console.log("sorry，该昵称不能为空");
        returnInfo.state = 0;
        returnInfo.info = "sorry，该昵称不能为空";
        res.send(returnInfo);
        return;
    }
    User.findOne({nickname: req.body.nickname}, function (error, result) {
        if (result) {
            console.log("sorry，该昵称已存在");
            returnInfo.state = 0;
            returnInfo.info = "sorry，该昵称已存在";
            res.send(returnInfo);
            return;
        }else {
            User.findOne({username: req.body.username}, function (error, doc) {
                if (error) {
                    console.log(error);
                    return;
                }
                if (doc) {
                    console.log("查询到的用户信息");
                    console.log(doc);
                    doc.nickname = req.body.nickname;
                    doc.save(function (err) {
                        if(err){
                            console.log("更新失败");
                            console.log(err);
                            returnInfo.state = 0;
                            returnInfo.info = "更新失败";
                            res.send(returnInfo);
                            return;
                        }else{
                            console.log("更新成功")
                            returnInfo.state = 1;
                            returnInfo.info = "更新成功";
                            res.send(returnInfo);
                            return;
                        }
                    })
                } else {
                    console.log("用户名不存在");
                    returnInfo.state = 0;
                    returnInfo.info = "用户名不存在";
                    res.send(returnInfo);
                    return;
                }
            });
        }
    });
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

});

module.exports = router;
