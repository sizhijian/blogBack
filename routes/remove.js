var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url, {useMongoClient:true});

var Articles = mongoose.model('articles', articlesSchema);
//将模式编译到模型中model('集合名称',...)会变成全小写
var User = mongoose.model('users', usersSchema);

/* GET users listing. */
router.post('/', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
        state: null,
        info: ""
    };
    console.log(req.body);
    User.findOne({username: req.body.username})
    .then((userDoc) => {
        console.log(userDoc)
        if (userDoc) {
            Articles.remove({_id: req.body.id}, function (err) {
                if (err) {
                    console.log(err);
                    returnInfo.state = 0;
                    returnInfo.info = "刪除失败";
                    res.send(returnInfo);
                } else {
                    console.log("刪除成功");
                    returnInfo.state = 1;
                    returnInfo.info = "刪除成功";
                    res.send(returnInfo);
                }
            });
        } else {
            returnInfo.state = 0;
            returnInfo.info = "刪除失败,你不是作者";
            res.send(returnInfo);
        }
    });


    // res.send(returnInfo);
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
});

module.exports = router;
