var mysql = require('mysql');

var pool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : 'z2457098495924',
	database : 'youtube'
});


//通过用户名获取用户订阅号
exports.getChannelByUserName = function(username,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select channelId from user_channel where user=?';
		connection.query(sql,[username],callback);
		connection.release();
	});
};

//通过用户名和订阅号ID添加用户订阅号
exports.addUserChannel = function(username,channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'insert into user_channel(user,channelId) values(?,?) ';
		connection.query(sql,[username,channelId],callback);
		connection.release();
	});
};


//通过用户名和订阅号ID删除用户订阅号
exports.deleteUserChannel = function(username,channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'delete from user_channel where user=? and channelId=?';
		connection.query(sql,[username,channelId],callback);
		connection.release();
	});
};
