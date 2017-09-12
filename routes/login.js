var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var crypto = require('crypto');
var Title = '用户登录';

var checkNotLogin = require('../middlewares/check').checkNotLogin;
var sendMail = require('../models/node-email.js'); 

var crypto = require('crypto');//密码加密

/* GET login page. */
router.get('/', checkNotLogin, function(req, res, next) {
	res.render('login', { title: Title });
});

router.post('/', checkNotLogin, function(req, res, next){
    var username = req.body.username;
    var userpwd = req.body.password;
    // var rempwd = req.body.rempwd;//记住密码
    var md5 = crypto.createHash('md5');
    userpwd = md5.update(userpwd).digest('hex');

    User.getuserByUserName(username, function(err,results){
        // console.log(results);
        if(results.length===0){
            req.flash('error','用户不存在');
            return res.redirect('/login');
        }
        if(results[0].username !== username || results[0].userpass !== userpwd){
            req.flash('error','用户名或密码有误');
            return res.redirect('/login');
        }
        // //如果点击记住密码
        // if(rempwd){
            
        //     res.cookie('islogin', results[0], { maxAge: 86400000 });//一天                
        // }

        req.flash('success','登录成功');
        delete results[0].userpass;
        
        res.locals.user = results[0];
        req.session.user = res.locals.user; 
        return res.redirect('/');          
    });
});

/* GET login/forget-password page. */
router.get('/forget-password', checkNotLogin, function(req, res, next) {
    res.render('forget', { title: '忘记密码' });
});

router.post('/forget-password', checkNotLogin, function(req, res, next) {
    var username = req.body.username;
    var useremail = req.body.useremail;
    User.getuserByUserName(username, function(err,results){
        // console.log(results);
        if(results.length===0){
            req.flash('error','用户不存在');
            return res.redirect('/login/forget-password');
        }
        if(results[0].useremail !== useremail){
            req.flash('error','该用户没有该邮箱');
            return res.redirect('/login/forget-password');
        }
        sendMail.send(useremail,'请点击下面链接找回密码:<a href="http://localhost:8080/login/findPassword">http://localhost:8080/login/findPassword</a>',function(err,result){
            if(!err){
                req.flash('success','邮箱发送成功,请打开邮箱确认(需等待一段时间)');
                return res.redirect('/login');
            }else{
                req.flash('error','找回密码错误，请重新尝试');
                return res.redirect('/login/forget-password');
            }
        })
    });
});

/* GET login/findPassword page. */
router.get('/findPassword', checkNotLogin, function(req, res, next) {
    res.render('findpassword', { title: '重置密码' });
});

router.post('/findPassword', checkNotLogin, function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(password!==repassword){
        req.flash('error','两次密码不一致');
        return res.redirect('/login/findPassword');
    }
    if(password.length<6){
        req.flash('error','密码小于六位');
        return res.redirect('/login/findPassword');
    }

    User.getuserByUserName(username, function(err,results){
        // console.log(results);
        if(results.length===0){
            req.flash('error','用户不存在');
            return res.redirect('/login/findPassword');
        }else{
            //密码加密处理
            var md5 = crypto.createHash('md5');
            password = md5.update(password).digest('hex');

            User.UpdateuserByUserName(username,password,function(err){
                if(err) return next(err);
                req.flash('success','请点击登录');
                return res.redirect('/login');
            });
      }
    });
});

module.exports = router;

