var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Title = '用户注册';

var User = require('../models/user.js');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

/* GET home page. */
router.get('/', checkNotLogin, function(req, res, next) {
   res.render('signup', { title: Title });
});

router.post('/', checkNotLogin, function(req,res,next){
    var username = req.body.username;
    var userpwd = req.body.password;
    var userrepwd = req.body.repassword;
    var useremail = req.body.email;
    var gender = req.body.gender;
    
    //console.log(username);
    if(username.length<2){
        req.flash('error','用户名长度小于2');
        return res.redirect('/signup');
    }
    if(userpwd!==userrepwd){
    	req.flash('error','两次密码不一致');
    	return res.redirect('/signup');
    }
    if(userpwd.length<6){
        req.flash('error','密码小于六位');
        return res.redirect('/signup');
    }
    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!reg.test(useremail)){
        req.flash('error','邮箱格式不正确');
        return res.redirect('/signup');
    }

    //密码加密处理
    var md5 = crypto.createHash('md5');
    userpwd = md5.update(userpwd).digest('hex');

    var newUser = new User({
        username: username,
        userpass: userpwd,
        useremail: useremail,
        gender: gender
    });

    //检查用户名是否存在
    User.getUserNumByName(newUser.username,function(err,results){
        //console.log(results);
        if(results !== null && results[0]['num'] > 0){
            req.flash('error','用户已存在');
            return res.redirect('/signup');
        }
        //检查邮箱是否存在
        User.getUserNumByEmail(newUser.useremail,function(err,resultemails){
            if(resultemails !== null && resultemails[0]['num'] > 0){
                req.flash('error','邮箱已存在');
                return res.redirect('/signup');
            }
            newUser.save(function(err,result){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/signup');
                }
                // console.log(result);
                if(result.insertId > 0){
                    delete newUser.userpass;
                    req.session.user = newUser;
                    req.flash('success','注册成功');
                    return res.redirect('/login');
                }else{
                    req.flash('error',err);
                    return res.redirect('/signup');
                }
                res.render('signup',{title: Title});
            });
        }); 
    });
});

module.exports = router;