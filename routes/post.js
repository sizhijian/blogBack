var express = require('express'),
    router = express.Router(),
    articlesSchema = require('../models/articles'),
    usersSchema = require('../models/users'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbUrl = require('../config/db.conf');

mongoose.connect(dbUrl.url, {useMongoClient:true});

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
    console.log(req.body.id);
    if(req.body.id){
      Articles.findOne({_id: req.body.id},function (err, doc) {
        if(err){
          console.log(err)
          return;
        }
        if(doc){
          console.log(111111111)
          doc.title = req.body.title;
          doc.type = req.body.type;
          doc.body = req.body.content;
          doc.updated_at = new Date();
          doc.save(function (err) {
            if(err){
              console.log(err);
              returnInfo.state = 0;
              returnInfo.info = "更新失败";
              res.send(returnInfo);
              return;
            }else {
              console.log("更新成功");
              returnInfo.state = 1;
              returnInfo.info = "更新成功";
              res.send(returnInfo);
              return;
            }
          });
        }else{
          console.log(err);
          returnInfo.state = 0;
          returnInfo.info = "更新失败";
          res.send(returnInfo);
          return;
        }
      })
    } else {
      var articles = new Articles({
        title: req.body.title,
        author: req.body.author,
        type: req.body.type,
        body: req.body.content,
        // created_at: Date.now()
      });
      // res.send(returnInfo);
      // return;
      articles.save(function (err) {
        if(err){
          console.log(err);
          returnInfo.state = 0;
          returnInfo.info = "插入失败";
          res.send(returnInfo);
        }else {
          console.log("插入成功");
          returnInfo.state = 1;
          returnInfo.info = "插入成功";
          res.send(returnInfo);
        }
      });
    }
    return;
    Articles.findOne({type: req.body.type},function (err, articles) {
        if(err){
            console.log(err)
        }else {
            if(articles) {
              var flag = false;
              for (var i = 0; i < articles.contain.length; i++) {
                if (articles.contain[i].title == req.body.title) {
                  flag = false
                }else{
                  flag = true
                }
              }
              if(flag){
                console.log("没有相同标题的文章,可以正常插入");
                articles.contain.push({
                    title: req.body.title,
                    author: req.body.author,
                    date: moment(),
                    content: req.body.content
                });
                console.log(articles)
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
              }else{
                console.log("插入失败,已经存在相同标题的文章");
                returnInfo.state = 0;
                returnInfo.info = "发表失败,已经存在相同标题的文章";
                res.send(returnInfo);
              }

            }else {
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
