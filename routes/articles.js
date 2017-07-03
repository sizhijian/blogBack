var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url);

var Articles = mongoose.model('articles', articlesSchema);//将模式编译到模型中model('集合名称',...)会变成全小写
var User = mongoose.model('users', usersSchema);
/* GET users listing. */
router.get('/', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
        state: null,
        info: ""
    };
    console.log(req.body);
    var userList = [];
    User.find().then(function(userList){
        // console.log(userList)
        Articles.find().sort({"created_at": -1}).exec(function (err, doc) {
            if (err) {
                // console.log(err)
                return;
            }
            if (doc) {
                doc.forEach(function (item) {
                    userList.forEach(function (subitem) {

                        if(item.author == subitem.username) {
                            item.author = subitem.nickname
                        }
                    });

                });
                returnInfo.info = doc;
                res.send(returnInfo);
            }
        });
    });
});

module.exports = router;
