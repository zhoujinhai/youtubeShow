var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
		user: 'zhoujinhai_xx@163.com', //邮箱的账号
		pass: 'send163email'//邮箱的授权密码
    }
});

/**
 ** 发送邮件
*/
exports.send = function(to,content,callback){
	var mailOptions = {
		from: '"youtubeShow"<zhoujinhai_xx@163.com>',//邮件来源
		to: to,//邮件发送到哪里，多个邮箱使用逗号隔开
		subject: '找回密码',// 邮件主题
		html: content//邮件内容
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
			console.log(error);
		    callback(error,null);
	    }else{
			callback(null,info);
		}
	    //console.log('Message %s sent: %s', info.messageId, info.response);
	});
}