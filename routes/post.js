var express = require('express'),
    router = express.Router(),
	registerSchema = require('../models/articles'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/blog');

var Articles = mongoose.model('articles',registerSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.post('/', function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: null,
	    info:""
    };
    console.log(req.body);
    Articles.findOne({type: req.body.type},function (err, articles) {
        console.log(articles)
        if(err){
            console.log(err)
        }else {
            if(articles) {
                console.log("adadada")
                articles.contain.push({
                    title: req.body.title,
                    content: req.body.content
                });
                articles.save(function (err) {
                    if(err){
                        console.log("插入失败");
                        console.log(err);
                        returnInfo.state = 0;
                        returnInfo.info = "插入失败";
                        res.send(returnInfo);
                    }else{
                        console.log("插入 success")
                        returnInfo.state = 1;
                        returnInfo.info = "插入成功";
                        res.send(returnInfo);
                    }
                })
            }else {
                console.log("passssssssssssssss")
                Articles.create([{
                    type: req.body.type,
                    contain: [
                        {
                            title: req.body.title,
                            content: req.body.content
                        }]
                }],function (error) {
                    if(error) {
                        console.log(error)
                        returnInfo.state = 0;
                        returnInfo.info = "提交失败";
                        res.send(returnInfo);
                    }
                    returnInfo.state = 1;
                    returnInfo.info = "提交成功";
                    res.send(returnInfo);
                });
            }
        }
    });

    // res.send(returnInfo);
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
});

module.exports = router;
