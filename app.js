var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

//
var register = require('./routes/register'),
    login = require('./routes/login'),
    articles = require('./routes/articles'),
    articlesType = require('./routes/articlesType'),
    post = require('./routes/post'),
    modify = require('./routes/modify'),
    remove = require('./routes/remove'),
    comment = require('./routes/comment'),
    upload = require('./routes/upload');
//

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录
app.set('view engine', 'ejs');//设置视图模板引擎为 ejs

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//设置/public/favicon.ico为favicon图标
app.use(logger('dev'));//加载日志中间件
app.use(bodyParser.json({limit: '1000kb'}));//加载解析json的中间件
app.use(bodyParser.urlencoded({ extended: true }));//加载解析urlencoded请求体的中间件。
app.use(cookieParser());//加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源路径

// app.use('/', index);
// app.use('/users', users);
// app.use(session({
//     secret: 'blog',
//     key: 'blog',//cookie name
//     cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},//7 days
//     store: new MongoStore({
//         db: 'shop',
//         host: '192.168.1.62',
//         port: 27017
//     })
// }));
/*
* shop-api-begin
* */
app.use('/register', register);
app.use('/login', login);
app.use('/articles', articles);
app.use('/articlesType', articlesType);
app.use('/post', post);
app.use('/modify', modify);
app.use('/remove', remove);
app.use('/comment', comment);
app.use('/upload', upload);
/*
 * shop-api-end
 * */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('很抱歉，您要访问的页面不存在！');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
