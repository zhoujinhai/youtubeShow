var express = require('express');
var router = express.Router();
var channel = require('../models/channel');
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
	//查询订阅号排名列表
	channel.newChannelListSub(config.offset,config.channelNumber,function(err,channelList){
		if(err) return next(err);
		var order=1;
		//对得到的数据进行处理
		channelList.forEach(function(channel){
			var str = (channel.currentTime).toString();
			str = str.replace(/ GMT.+$/, '');// Or str = str.substring(0, 24)
			var d = new Date(str);

			var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
			for(var i = 0, len = a.length; i < len; i ++) {
			    if(a[i] < 10) {
			        a[i] = '0' + a[i];
			    }
			}
			channel.currentTime = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
			
			channel.order =order;
			order++;
		});
		//查询最新视频信息
		channel.newVideoInf(config.offset,config.newVideoNumber,function(err,newVideoList){
			if(err) return next(err);
			//查询最热视频信息
			channel.hotVideoInf(config.offset,config.hotVideoNumber,function(err,hotVideoList){
				if(err) return next(err);
				//查询高评分视频信息
				channel.higherSupVideoInf(config.offset,config.higherSupVideoNumber,function(err,higherSupVideoList){
					if(err) return next(err);
					res.render('index', { 
						title: 'youtubeShow',
						number: config.channelNumber,
						channelList: channelList,
						newVideoList: newVideoList,
						hotVideoList: hotVideoList,
						higherSupVideoList: higherSupVideoList
					});
				});
			});
		});
	});
});

module.exports = router;
