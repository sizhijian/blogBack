var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url);

var Articles = mongoose.model('articles',articlesSchema);
//将模式编译到模型中model('集合名称',...)会变成全小写
var User = mongoose.model('users',usersSchema);

/* GET users listing. */
router.post('/', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
        state: null,
        info:""
    };
    console.log(req.body);
    if(req.body.username){
        User.findOne({username: req.body.username}).then(function (userDoc) {
            console.log(1)
            if(userDoc){
                Articles.findOne({_id: req.body.id}, function (err, doc) {
                    if(err){
                        console.log(err);
                        returnInfo.state = 0;
                        returnInfo.info = "更新失败";
                        res.send(returnInfo);
                        return;
                    }
                    doc.comments.push({
                        reviewer: userDoc.username,
                        body: req.body.body
                    });
                    doc.save(function (err) {
                        if(err){
                            console.log(err);
                            returnInfo.state = 0;
                            returnInfo.info = "评论失败";
                            res.send(returnInfo);
                            return;
                        }else {
                            console.log("评论成功");
                            returnInfo.state = 1;
                            returnInfo.info = "评论成功";
                            res.send(returnInfo);
                            return;
                        }
                    });
                });
                // doc.updated_at = Date.now();
            }else{
                console.log(err);
                returnInfo.state = 0;
                returnInfo.info = "评论失败";
                res.send(returnInfo);
                return;
            }
        })
    }
    // res.send(returnInfo);
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
});

module.exports = router;
