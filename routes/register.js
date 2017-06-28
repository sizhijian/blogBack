var express = require('express'),
    router = express.Router(),
	registerSchema = require('../models/register'),
    mongoose = require('mongoose'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url);

var User = mongoose.model('users',registerSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.post('/', function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: null,
	    info:""
    };
    console.log(req.body);
    
    User.create([{
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname
    }],function (error) {
        if(error) {
	        console.log(error)
	        returnInfo.state = 0;
	        returnInfo.info = "注册失败";
	        res.send(returnInfo);
	        return;
        }
	    returnInfo.state = 1;
	    returnInfo.info = "注册成功";
	    res.send(returnInfo);
    });
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    
});

module.exports = router;
