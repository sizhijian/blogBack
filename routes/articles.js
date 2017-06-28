var express = require('express'),
    router = express.Router(),
	registerSchema = require('../models/articles'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url);

var Articles = mongoose.model('articles',registerSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.get('/', function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: null,
	    info:""
    };
    console.log(req.body);
    Articles.find(function (err, doc) {
        if (err) {
            console.log(err)
            return''
        }
        if (doc) {
        console.log(doc)
            returnInfo.info = doc;
        }
        res.send(returnInfo);
    });
});

module.exports = router;
