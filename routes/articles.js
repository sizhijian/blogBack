var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url, {useMongoClient:true});

var Articles = mongoose.model('articles', articlesSchema);//将模式编译到模型中model('集合名称',...)会变成全小写
var User = mongoose.model('users', usersSchema);
/* GET users listing. */
router.get('/', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
        state: 0,
        info: ""
    };
    // console.log(req.body);
    console.log(req.query.skip);
     if (req.query.id) {
        Articles.findOne({_id: req.query.id}, function (err, doc) {
            if (err) {
                console.log(err)
                return;
            }
            if (doc) {
                console.log(doc);
                returnInfo.state = 1;
                returnInfo.info = doc;
                res.send(returnInfo);
                return;
            } else {
                returnInfo.state = 0;
                res.send(returnInfo);
                return;
            }

        })
    } else if (req.query.author) {
        Articles.find({author: req.query.author})
            .sort({"updated_at": -1}).exec(function (err, doc) {
            // console.log(doc.length);
            returnInfo.info = doc;
            res.send(returnInfo);
            return;
        })
    } else {
        User.find().then(function (userList) {
            // console.log(userList)
            Articles.find().skip(req.query.skip * 10).limit(10).sort({"updated_at": -1}).exec(function (err, doc) {
                if (err) {
                    console.log(err)
                    return;
                }
                if (doc) {
                    if (req.query.username){
                        doc.forEach(function (item) {
                            userList.forEach(function (subitem) {
                                item.isAuthor = false;
                                if (item.author == req.query.username) {
                                    item.isAuthor = true;
                                }
                                item.comments.forEach(function(item) {
                                    item.isAuthor = false;
                                    if (item.reviewer == subitem.username) {
                                        item.isAuthor = true;
                                    }
                                })
                            });
                        });
                    }
                    doc.forEach(function (item) {
                        userList.forEach(function (subitem) {
                            if (item.author == subitem.username) {
                                item.author = subitem.nickname;
                                item.avatarUrl = subitem.avatarUrl;
                                // console.log(subitem.avatarUrl)
                            }
                            item.comments.forEach(function(item) {
                                if (item.reviewer == subitem.username) {
                                    item.reviewer = subitem.nickname;
                                    item.avatarUrl = subitem.avatarUrl;
                                }
                            })
                        });
                    });
                    returnInfo.info = doc;
                    res.send(returnInfo);
                }
            });
        });
    }
});

module.exports = router;
