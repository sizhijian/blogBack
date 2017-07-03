var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url);

var Articles = mongoose.model('articles',articlesSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
        state: 0,
        info:""
    };
    Articles.distinct("type",function (err, doc) {
        if (err) {
            console.log(err);
            return;
        }
        if (doc.length == 0) {
            console.log(doc);
            returnInfo.state = 0;
            returnInfo.info = "一种类型都没有";
        } else {
            console.log(doc);
            returnInfo.state = 1;
            returnInfo.info = doc;
        }
        res.send(returnInfo);
    });
});

module.exports = router;
