//后台管理
var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var Channel = require('../models/channel.js');
var userChannel = require('../models/user-channel.js');

var checkLogin = require('../middlewares/check').checkLogin;

var crypto = require('crypto');//密码加密

//后台管理主页
router.get('/:username/admin',checkLogin,function(req, res, next) {
  var username = req.params.username;
  //通过用户名获取用户的所有订阅号
  userChannel.getChannelByUserName(username,function(err,userChannelList){
      if(err) return next(err);
      if(userChannelList.length>0){
          for (var i = 0; i < userChannelList.length; i++) {
              var channelList = [];
              //通过订阅号ID获取订阅号信息
              Channel.getChannelById(userChannelList[i].channelId,function(err,channelInf){
                  if(err) return next(err);
                  var item={};
                  item.channelId = channelInf[0].channelId;
                  item.channelUrl = channelInf[0].channelUrl;//订阅号网址
                  item.channel = channelInf[0].channel;//订阅号名称
                  item.subscriber = channelInf[0].subscriber;//订阅号最新订阅量
                  channelList.push(item);

                  if(channelList.length===userChannelList.length){
                    res.render('admin/index',{
                      title: '后台管理',
                      username: username,
                      channelList: channelList
                    });
                  }
              });
          } 
      }else{
          var channelList = [];
          res.render('admin/index',{
              title: '后台管理',
              username: username,
              channelList: channelList
          });
        }
  });
});

//用户信息页
router.get('/:username/admin/information',checkLogin,function(req, res, next) {
  var username = req.params.username;
  User.getuserByUserName(username,function(err,user){
      if(err) return next(err);
      res.render('admin/user-info',{
        title: '用户信息',
        user: user[0],
        username: username
      });
  });
  
});

//修改密码页
router.get('/:username/admin/changepsw',checkLogin,function(req, res, next) {
  var username = req.params.username;
  res.render('admin/repsw',{
        title: '修改密码页',
        username: username
  });
});

router.post('/:username/admin/changepsw',checkLogin,function(req, res, next) {
    var username = req.params.username;
    var oldpsw = req.body.oldpsw;
    var newpsw = req.body.newpsw;
    var repsw = req.body.repsw;
    

    if(oldpsw.length<6){
        req.flash('error','原始密码错误');
        return res.redirect(`/user/${username}/admin/changepsw`);
    }
    if(newpsw.length<6){
        req.flash('error','密码小于六位');
        return res.redirect(`/user/${username}/admin/changepsw`);
    }
    if(newpsw!==repsw){
      req.flash('error','两次密码不一致');
      return res.redirect(`/user/${username}/admin/changepsw`);
    }
    
    

    User.getuserByUserName(username,function(err,user){
      if(err) console.log(err);

      //密码加密处理
      var md5 = crypto.createHash('md5');
      oldpsw = md5.update(oldpsw).digest('hex');

      if(oldpsw!==user[0].userpass){
        req.flash('error','原始密码错误');
        return res.redirect(`/user/${username}/admin/changepsw`);
      }else{

          //密码加密处理
          var md5 = crypto.createHash('md5');
          newpsw = md5.update(newpsw).digest('hex');

          User.UpdateuserByUserName(username,newpsw,function(err){
              if(err) return next(err);
              req.flash('success','修改成功');
              return res.redirect(`/user/${username}/admin`);
          });
      }
    })
});

//修改用户信息页
router.get('/:username/admin/changeInf',checkLogin,function(req, res, next) {
  var username = req.params.username;
  res.render('admin/reInfo',{
        title: '修改信息页',
        username: username
  });
});

router.post('/:username/admin/changeInf',checkLogin,function(req, res, next){
  var username = req.params.username;
  var rename = req.body.newusername;
  var regender = req.body.gender;
  var reemail = req.body.email;

  if(rename.length<4){
      req.flash('error','用户名长度小于4');
      return res.redirect(`/user/${username}/admin/changeInf`);
  }
  var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
  if(!reg.test(reemail)){
      req.flash('error','邮箱格式不正确');
      return res.redirect(`/user/${username}/admin/changeInf`);
  }

    //检查用户名是否存在
    User.getUserNumByName(rename,function(err,results){
        //console.log(results);
        if(results !== null && results[0]['num'] > 0){
            req.flash('error','用户已存在');
            return res.redirect(`/user/${username}/admin/changeInf`);
        }
        //检查邮箱是否存在
        User.getUserNumByEmail(reemail,function(err,resultemails){
            if(resultemails !== null && resultemails[0]['num'] > 0){
                req.flash('error','邮箱已存在');
                return res.redirect(`/user/${username}/admin/changeInf`);
            }
            var inf ={
              rename: rename,
              regender: regender,
              reemail: reemail
            };

            User.UpdateuserInf(username,inf,function(err){
              if(err) return console.log(err);
              req.flash('success','更改信息成功');
              return res.redirect(`/user/${rename}/admin/information`);
            });
        });
    });
});

//用户订阅号页
router.get('/:username/admin/subscriber',checkLogin,function(req, res, next) {
  var username = req.params.username;
  //通过用户名获取用户的所有订阅号
  userChannel.getChannelByUserName(username,function(err,userChannelList){
    if(err) return next(err);

    if(userChannelList.length>0){
      for (var i = 0; i < userChannelList.length; i++) {
          var channelOfUser = [];
          //通过订阅号ID获取订阅号信息
          Channel.getChannelById(userChannelList[i].channelId,function(err,channelList){
              if(err) return next(err);
              channelOfUser.push(channelList[0]);
              if(channelOfUser.length===userChannelList.length){
                res.render('admin/user-sub',{
                  title: '用户订阅号',
                  username: username,
                  channelOfUser: channelOfUser
                });
              }
          });
      } 
    }else{
        var channelOfUser = [];
        res.render('admin/user-sub',{
          title: '用户订阅号',
          username: username,
          channelOfUser: channelOfUser
        });
    }
    
  });
});

//用户订阅号添加页
router.get('/:username/admin/subscriber/add',checkLogin,function(req, res, next) {
    var username = req.params.username;
    //获取订阅号，用于下拉菜单
    Channel.channelList(300,function(err,allChannel){
        if(err) return next(err);
        res.render('admin/user-sub-add',{
           title: '添加订阅号',
           username: username,
           allChannel: allChannel
        });
    });
    
});

//用户订阅号添加页
router.post('/:username/admin/subscriber/add',checkLogin,function(req, res, next) {
    var username = req.params.username;
    var channelId = req.body.channelId;
    // console.log(channelId);
    // 先判断用户是否有订阅
    userChannel.getChannelByUserName(username,function(err,channelIdList){
      if(err) return next(err);
      //用户没有添加订阅 则将信息存入数据库
      if(channelIdList.length===0){
          userChannel.addUserChannel(username,channelId,function(err){
            if(err) return next(err);
            req.flash('success','添加成功');
            return res.redirect(`/user/${username}/admin/subscriber`);
          });
      }
      //用户有订阅
      if(channelIdList.length>0){
          for(var i=0;i<channelIdList.length;i++){
            if(channelId===channelIdList[i].channelId){
                req.flash('error','订阅已存在');
                return res.redirect(`/user/${username}/admin/subscriber/add`);
            }
          }
          //不存在则添加
          userChannel.addUserChannel(username,channelId,function(err){
            if(err) return next(err);
            req.flash('success','添加成功');
            return res.redirect(`/user/${username}/admin/subscriber`);
          });
      }
    });
});

//删除某个用户的某个订阅
router.get('/:username/:channelId/remove',checkLogin,function(req,res,next){
   var username=req.params.username;
   var channelId=req.params.channelId;

   userChannel.deleteUserChannel(username,channelId,function(err){
      if(err) return next(err);
      req.flash('success','删除成功');
      //删除后跳转到用户列表
      res.redirect(`/user/${username}/admin/subscriber`);
   });
     
});

module.exports = router;



