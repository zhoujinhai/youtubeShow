var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

/* GET login page. */
router.get('/', checkLogin, function(req, res, next) {
  //清空session中用户信息
  req.session.user = null;
  req.flash('success','退出成功');
  res.redirect('/');
});

module.exports = router;