var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    const loginInfo =
        {
            username: 'sizhijian',
            password: '123456'
        };
    res.header("Access-Control-Allow-Origin", "*");
    var returnInfo = {};
    console.log(req.body);
    console.log(req.body.password);
    console.log(req.body.password == loginInfo.password)
    if (req.body.username == loginInfo.username && req.body.password == loginInfo.password) {
            returnInfo.state = 1;
            returnInfo.info = "登陆成功";
            returnInfo.nickName = "司志健";

    } else {
            returnInfo.state = 0;
            returnInfo.info = "账号或密码错误";
    }

    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.send(returnInfo);
});

module.exports = router;
