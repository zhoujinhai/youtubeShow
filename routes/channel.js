var express = require('express');
var router = express.Router();
var channel = require('../models/channel');
var config = require('../config');
var compare = channel.compare;

/* GET channel listing. */
router.get('/', function(req, res, next) {
	var page=Number(req.query.page||1);//当前页 默认为第1页
	var limit=100;//每页显示数量
    var skip=(page-1)*limit;//第i页跳过的数量
	channel.allChannelListOrderByName(skip,limit,function(err,allChannelList){
		if(err) return next(err);
		channel.allCount(0,function(err,result){
			if(err) return next(err);
			//计算总页数
		    pages=Math.ceil((result.length)/limit);
		    //取值不能超过pages,不能小于1
	        page=Math.min(pages,page);
		    page=Math.max(page,1);
			res.render('allChannel',{
				title:'全部订阅号',
				page:page,
				skip:skip,
				limit:limit,
				allChannelList:allChannelList
			});
		});	
	});
});

/* GET channel/order-by-subscribers?number=xxx */
router.get('/order-by-subscribers',function(req,res,next){
	var number = Number(req.query.number);
	var offset = 0;
	if(req.query.number===undefined){
		number = 40;
	}
	if(number>=50){
		offset = number-50;
	}
	
	//查询订阅号排名列表
	channel.newChannelListSub(offset,number-offset,function(err,channelList){
		if(err) return next(err);
		var order=offset+1;
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
					res.render('subscribers',{
						title: '订阅号排名',
						number: number,
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

/* GET channel/order-by-gains?time=xxx */
router.get('/order-by-gains',function(req,res,next){
	var time = Number(req.query.time);
	if(req.query.time===undefined){
		time = 168;//一周的小时量
	}
	var channelGainList = [];
	channel.channelList(40,function(err,allChannelList){
		if(err) return next(err);
		for(var i=0;i<allChannelList.length;i++){

			channel.getGainByChannelId(allChannelList[i].channelId,function(err,channelListByTime){
				if(err) return next(err);
				var gain ;
				var item = {};
				if(time<channelListByTime.length){
					gain = channelListByTime[0].subscriber-channelListByTime[time].subscriber;
				}else{
					gain = channelListByTime[0].subscriber-channelListByTime[channelListByTime.length-1].subscriber;
				}
				item.channelName = channelListByTime[0].channel;
				item.channelId = channelListByTime[0].channelId;
				item.gain = gain;
				item.subscriber = channelListByTime[0].subscriber;
				item.channelUrl = channelListByTime[0].channelUrl;
				if(item.hasOwnProperty('gain')){
					channelGainList.push(item);
				}
				if(channelGainList.length===allChannelList.length){
					channelGainList = channelGainList.sort(compare('gain'));
					channel.hotVideoInf(0,10,function(err,hotVideoList){
						if(err) return next(err);
						res.render('gains',{
							title : '增长量排名页',
							channelGainList : channelGainList,
							hotVideoList : hotVideoList
						});
					});
				}
			});
		}
	});
});


/* GET channel/:channelId */
router.get('/:channelId',function(req,res,next){
	var channelId = req.params.channelId;
	channel.getChannelById(channelId,function(err,channelInf){
		if(err) return console.log(err);
		var channelUrl = channelInf[0].channelUrl;//订阅号网址
		var channelName = channelInf[0].channel;//订阅号名称
		var channelSubscribers = channelInf[0].subscriber;//订阅号最新订阅量
		//用于获取前一天的前一个订阅量
		var newerTime = channelInf[0].currentTime;
		newerTime = Number(newerTime.toString().substr(16, 2));
		
		//获取分类信息(侧边栏)
		channel.getCagegoryBychannelId(channelId,channelSubscribers,function(err,categoryList){
			if(err) return console.log(err);
			var channelVideoCount = 0;
			for(var i=0;i<categoryList.length;i++){
				channelVideoCount += categoryList[i].categoryVideos;
			}
			//前一天的数据
			channel.getSubscriberByChannelId(1,channelId,function(err,channelDaySubList){
				if(err) return next(err);
				if((newerTime+25)<channelInf.length){
					channelDaySubList[0].gain = channelDaySubList[0].subscriber-channelInf[newerTime+25].subscriber;
				}else{
					channelDaySubList[0].gain = '000';
				}
				for(var i=0;i<channelDaySubList.length-1;i++){
					channelDaySubList[i+1].gain = channelDaySubList[i+1].subscriber - channelDaySubList[i].subscriber;
				}
				//近七天的数据
				channel.getSubscriberByChannelId(7,channelId,function(err,channelSevenDaySubList){
					if(err) return next(err);
					if((newerTime+(25*7))<channelInf.length){
						channelSevenDaySubList[0].gain = channelSevenDaySubList[0].subscriber-channelInf[newerTime+(25*7)].subscriber;
					}else{
						channelSevenDaySubList[0].gain = '000';
					}
					for(var i=0;i<channelSevenDaySubList.length-1;i++){
						channelSevenDaySubList[i+1].gain = channelSevenDaySubList[i+1].subscriber - channelSevenDaySubList[i].subscriber;
					}
					//侧边栏视频
					channel.getVideosByChannelId(0,channelId,function(err,channelVideos){
						if(err) return next(err);
						res.render('channel',{
							title: '订阅号具体信息页',
							channelId : channelId,
							channelUrl : channelUrl,
							channelName : channelName,
							channelSubscribers : channelSubscribers,
							categoryList : categoryList,
							channelVideoCount : channelVideoCount,
							channelDaySubList : channelDaySubList,
							channelSevenDaySubList : channelSevenDaySubList,
							channelVideos: channelVideos
						});

					});

				});
				
			});
		});
	});
});

router.get('/:channelId/allVideos',function(req, res, next) {
  var channelId = req.params.channelId;
  channel.getVideosByChannelId(1,channelId,function(err,channelVideoList){
  	if(err) return next(err);
  	var order = 1;
  	res.render('channel-video',{
  		title:'订阅号下所有视频',
  		order: order,
  		channelVideoList: channelVideoList
  	});
  })
});

module.exports = router;
