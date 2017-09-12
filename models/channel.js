var mysql = require('mysql');

var pool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : 'z2457098495924',
	database : 'youtube'
});


//获取订阅号
exports.channelList = function(limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select channelId,channel from channel group by channelId order by channel limit ?';
		connection.query(sql,[limit],callback);
		connection.release();
	});
};

//获取全部订阅号
exports.allChannelListOrderByName = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select * from channel group by channelId order by channelId limit ?,?';
		connection.query(sql,[offset,limit],callback);
		connection.release();
	});
};

//获取订阅号和视频数量(0：订阅号，1：视频)
exports.allCount = function(number,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		if(number===0){
			var sql = 'select distinct channelId from channel';
		    connection.query(sql,callback);
		    connection.release();
		}
		if(number===1){
			var sql = 'select count(videoId) as count from information';
		    connection.query(sql,callback);
		    connection.release();
		}
	});
};

//获取最新的订阅量
exports.newChannelListSub = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err){
			return console.log(err);
		}
	var sql = 'select * from channel a join (select max(currentTime) as currentTime from channel group by channelId) b on a.currentTime=b.currentTime group by channel order by a.subscriber desc, a.currentTime desc limit ?,?';
	
				
		connection.query(sql,[offset,limit],callback);
				
		connection.release();
	});
};

//获取全部视频（视频页）
exports.allVideoList = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select a.*,b.duration from information a left join video b on a.videoId = b.videoId order by a.videoId limit ?,?';
		connection.query(sql,[offset,limit],callback);
		connection.release();
	});
};

//获取最新视频信息
exports.newVideoInf = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select videoId,videoName,pubTime,videoClass,viewCount,support,oppose from information order by pubTime desc limit ?,?';
		connection.query(sql,[offset,limit],callback);
		connection.release();
	});
};

//获取最热视频信息
exports.hotVideoInf = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select videoId,videoName,pubTime,videoClass,viewCount,support,oppose from information order by viewCount desc limit ?,?';
		connection.query(sql,[offset,limit],callback);
		connection.release();
	});
};

//获取高评分视频信息
exports.higherSupVideoInf = function(offset,limit,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select videoId,videoName,pubTime,videoClass,viewCount,support,oppose from information order by support desc limit ?,?';
		connection.query(sql,[offset,limit],callback);
		connection.release();
	});
};

//获取指定订阅号Id的相关信息
exports.getChannelById = function(channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select channel,channelId,subscriber,channelUrl,currentTime from channel where channelId=? order by currentTime desc';
		connection.query(sql,[channelId],callback);
		connection.release();
	});
};

//联合video表获取指定订阅号Id的视频分类信息
exports.getCagegoryBychannelId = function(channelId,subscriber,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select distinct a.categoryName,a.channelName,a.categoryVideos,b.subscriber from video a left join channel b on a.channelId = b.channelId where b.channelId =? and b.subscriber=? order by b.currentTime desc';
		connection.query(sql,[channelId,subscriber],callback);
		connection.release();
	});
};

//获取指定视频Id的最新相关信息
exports.getVideoById = function(videoId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select a.*,b.duration,b.channelName,b.categoryName from information a left join video b on a.videoId = b.videoId where a.videoId=? ';
		connection.query(sql,[videoId],callback);
		connection.release();
	});
};



//获取指定视频分类下的视频信息
exports.getVideoByvideoClass = function(videoClass,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select * from information where videoClass=? limit 10';
		connection.query(sql,[videoClass],callback);
		connection.release();
	});
};

//获取指定订阅号的订阅的增长量
exports.getGainByChannelId = function(channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		var sql = 'select * from channel where channelId=? order by currentTime desc';
		connection.query(sql,[channelId],callback);
		connection.release();
	});
};

//对增长量进行排序
exports.compare = function(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
};

//获取指定订阅号的订阅某段时间的订阅量
exports.getSubscriberByChannelId = function(time,channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		if(time===1){
			//前一天的订阅量
			var sql = 'select * from channel where channelId=? and datediff(currentTime,now())=-1 order by currentTime';
			connection.query(sql,[channelId],callback);
		}
		if(time>1&&time<30){
			//最近多少天23点的订阅量
			var sql = 'select * from channel where channelId=? and date_sub(curdate(), interval ? day) <= date(currentTime) and currentTime like "%23:%" order by currentTime';
			connection.query(sql,[channelId,time],callback);
		}
		connection.release();
	});
};

//获取指定订阅号的视频
exports.getVideosByChannelId = function(amount,channelId,callback){
	pool.getConnection(function(err,connection){
		if(err) return console.log(err);
		if(amount===0){
			//侧边栏展示视频
			var sql = 'select videoName,videoId from video where channelId=? limit 10';
			connection.query(sql,[channelId],callback);
		}
		if(amount===1){
			//订阅号下全部视频
			var sql = 'select a.*,b.duration,b.channelName from information a left join video b on a.videoId = b.videoId where b.channelId=?';
			connection.query(sql,[channelId],callback);
		}
		
		connection.release();
	});
};