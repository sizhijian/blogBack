var express = require('express'),
    router = express.Router(),
	registerSchema = require('../models/articles'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/blog');

var Articles = mongoose.model('articles',registerSchema);//将模式编译到模型中model('集合名称',...)会变成全小写

/* GET users listing. */
router.get('/', function (req, res, next) {
    
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {
	    state: null,
	    info:""
    };
    console.log(req.body);

    // Articles.create([{
    //     menu: 'MongoDB',
    //     type: 'soup-can',
    //     contain: [
    //         {
    //             title: 'MongoDB Shell常用命令',
    //             content: '### mongoDB 可视化工具 robomongo\n---\n\n\n### 下表为mongodb启动的参数说明：\n\n参数 | 描述\n---|---\n--bind_ip |	绑定服务IP，若绑定127.0.0.1，则只能本机访问，不指定默认本地所有IP\n--logpath |	定MongoDB日志文件，注意是指定文件不是目录\n--logappend |	使用追加的方式写日志\n--dbpath |	指定数据库路径\n--port |	指定服务端口号，默认端口27017\n--serviceName |	指定服务名称\n--serviceDisplayName |	指定服务名称，有多个mongodb服务时执行。\n--install |	指定作为一个Windows服务安装。\n\n\n### mongo各命令的含义\n- mongo.exe，命令行客户端工具。\n- mongod.exe，数据库服务程序。\n- mongodump.exe，数据库备份程序。\n- mongoexport.exe，数据导出工具。\n- mongofiles.exe，GridFS工具。\n- mongoimport.exe，数据导入工具。\n- mongorestore.exe，数据库恢复工具。\n- mongos.exe，性能检测工具。\n\n### 将MongoDB服务器作为Windows服务运行\ncd mongoDB安装目录下\n```\nmongod.exe --logpath \"D:\data\dbConf\mongodb.log\" --logappend --dbpath \"D:\data\db\" --serviceName \"MongoService\" --install\n```\n### MongoDB后台管理 Shell\n```\nmongo //进入管理shell\n>    db //查看当前操作的文档（数据库）\n>    show dbs //显示所有数据的列表\n>    use (db) 可以连接到一个指定的数据库。\n```\n### 删除数据库\n```\nuse dbName\ndb.sropDatabase();\n```\n## 查看集合的所有項\n```\ndb.collectionName.find();\ndb.collectionName.find().pretty();//格式化 查看\n```\n## insert\n```\n> db.collectionName.insert({x:10})\nWriteResult({ \"nInserted\" : 1 })\n> db.runoob.find()\n{ \"_id\" : ObjectId(\"5604ff74a274a611b0c990aa\\"), \\"x\\" : 10 }\n>\n```\n## update\n```\ndb.collectionName.update(\n<query>,//查询条件\n<update>,//update的对象和一些更新的操作符（如$,$inc...）等\n{\n upsert: <boolean>,//可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入\nmulti: <boolean>,//可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。\nwriteConcern: <document>//可选，抛出异常的级别。\n}\n)\n```\n```\ndb.collectionName.update({\'x\':\'10\'},{$set:{\'x\':\'12\'}})\n```\n- 只更新第一条记录：\n- db.col.update( { \\"count\" : { $gt : 1 } } , { $set : { \"test2\" : \"OK\"} } );\n- 全部更新：\n- db.col.update( { \"count\" : { $gt : 3 } } , { $set : { \"test2\" : \"OK\"} },false,true );\n- 只添加第一条：\n- db.col.update( { \"count\" : { $gt : 4 } } , { $set : { \"test5\" : \"OK\"} },true,false );\n- 全部添加加进去:\n- db.col.update( { \"count\" : { $gt : 5 } } , { $set : { \"test5\" : \"OK\"} },true,true );\n- 全部更新：\n- db.col.update( { \"count\" : { $gt : 15 } } , { $inc : { \"count\" : 1} },false,true );\n- 只更新第一条记录：\n- db.col.update( { \"count\" : { $gt : 10 } } , { $inc : { \"count\" : 1} },false,false );\n## remove\n```\ndb.collectionName.remove(\n<query>,//（可选）删除的文档的条件。\n{\n justOne: <boolean>,//（可选）如果设为 true 或 1，则只删除一个文档。\n writeConcern: <document>//（可选）抛出异常的级别。\n}\n)\n```\n```\ndb.collectionName.remove({});\n```\n## find\n```\ndb.collectionName.find(\nquery,//可选，使用查询操作符指定查询条件\nprojection//可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）\n)\n```\nfind 条件 OR\n```\ndb.collectionName.find({key1:value1, key2:value2}).pretty();\ndb.collectionName.find(\n{\n  $or: [\n	     {key1: value1}, {key2:value2}\n  ]\n}\n).pretty()\n```\n\n'}
    //     ]
    // }
    // ],function (error) {
    //     if(error) {
	 //        console.log(error)
	 //        returnInfo.state = 0;
	 //        returnInfo.info = "注册失败";
	 //        res.send(returnInfo);
	 //        return;
    //     }
	 //    returnInfo.state = 1;
	 //    returnInfo.info = "注册成功";
	 //    res.send(returnInfo);
    // });
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    Articles.find(function (error, doc) {
        if (error) {
            console.log("全是错误");
            return;
        }
        if (doc) {
        console.log(doc)
            returnInfo.info = doc;
        }
        res.send(returnInfo);
    });
});

module.exports = router;
