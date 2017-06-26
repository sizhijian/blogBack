var express = require('express');
router = express.Router(),
	registerSchema = require('../models/register'),
	mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shop');

var User = mongoose.model('users', registerSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.post('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var returnInfo = {
		state: null,
		info: ""
	};
	console.log("接收到的登录信息")
	console.log(req.body);
	
	User.findOne({username: req.body.username}, function (error, doc) {
		if (error) {
			console.log("全是错误");
			return;
		}
		if (doc) {
			console.log("查询到的用户信息");
			console.log(doc);
			if (req.body.username == doc.username && req.body.password == doc.password) {
				returnInfo.state = 1;
				returnInfo.info = "登陆成功";
				returnInfo.nickname = doc.nickname;
				
			} else {
				returnInfo.state = 0;
				returnInfo.info = "账号或密码错误";
			}
		} else {
			console.log("用户名不存在");
			returnInfo.state = 0;
			returnInfo.info = "用户名不存在";
		}
		res.send(returnInfo);
	});
	
	
	// res.header("Access-Control-Allow-Headers", "X-Requested-With");
	// res.header("Access-Control-Allow-Headers", "Content-Type");
	// res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	
});

module.exports = router;
