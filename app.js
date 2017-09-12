var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//中间件，用于显示通知
var session = require('express-session');
var flash = require('connect-flash');

var config = require('./config');
var pkg = require('./package');
var index = require('./routes/index');
var channel = require('./routes/channel');
var video = require('./routes/video');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//传入一个密钥加session id
app.use(cookieParser('keyboard cat'));
//使用中间件
app.use(session({
  secret:'keyboard cat',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,
  saveUninitialized:false// 设置为 false，强制创建一个 session，即使用户未登录
}));
//flash中间件，用来显示通知
app.use(flash());

// 设置模板全局常量
app.locals.youtube = {
  title: pkg.name,
  channelNumber: config.channelNumber
};

//添加模板必须的变量
app.use(function(req,res,next){
   res.locals.user=req.session.user;
   res.locals.success=req.flash('success').toString();
   res.locals.error=req.flash('error').toString();
   next();
});

app.use('/', index);
app.use('/channel',channel);
app.use('/video',video);
app.use('/login',login);
app.use('/logout',logout);
app.use('/signup',signup);
app.use('/user',user);

// catch 404 and forward to error handler
app.use(function (req, res) {
  if (!res.headersSent) {
    res.status(404).render('404');
  }
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

app.listen(8080,function(){
   console.log(`${pkg.name} listen on localhost:${config.port}`);
});
module.exports = app;
