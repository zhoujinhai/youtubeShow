var express = require('express');
var router = express.Router();
var channel = require('../models/channel');
var config = require('../config');

/* GET views listing. */
router.get('/', function(req, res, next) {
	var page=Number(req.query.page||1);//当前页 默认为第1页
	var limit=200;//每页显示数量
    var skip=(page-1)*limit;//第i页跳过的数量
	channel.allVideoList(skip,limit,function(err,allVideoList){
		if(err) return next(err);
		channel.allCount(1,function(err,result){
			if(err) return next(err);
			//计算总页数
		    pages=Math.ceil((result[0].count)/limit);
		    //取值不能超过pages,不能小于1
	        page=Math.min(pages,page);
		    page=Math.max(page,1);
		    res.render('allVideo',{
				title:'全部视频',
				pages:pages,
				page:page,
				skip:skip,
				limit:limit,
				allVideoList:allVideoList
			});
		});
	});
});

/* GET video/order-by-views?number=xxx */
router.get('/order-by-views',function(req,res,next){
	var number = Number(req.query.number);
	var offset = 0;
	if(req.query.number===undefined){
		number = 40;
	}
	if(number>=500){
		offset = number-500;
	}
	channel.hotVideoInf(offset,number-offset,function(err,videoViewList){
		if(err) return next(err);
		channel.newVideoInf(config.offset,config.newVideoNumber+2,function(err,newVideoList){
			if(err) return next(err);
			channel.higherSupVideoInf(config.offset,config.higherSupVideoNumber+2,function(err,higherSupVideoList){
				if(err) return next(err);
				res.render('views',{
					title: '观看量排名',
					offset: offset,
					number: number,
					videoViewList: videoViewList,
					newVideoList: newVideoList,
					higherSupVideoList: higherSupVideoList
				});
			});
		});
	});
});

/* GET video/:videoId */
router.get('/:videoId',function(req,res,next){
	var videoId = req.params.videoId;
	channel.getVideoById(videoId,function(err,videoInf){
		if(err) return console.log(err);
		var videoClass = videoInf[0].videoClass;
		channel.getVideoByvideoClass(videoClass,function(err,categoryVideoList){
			if(err) return console.log(err);
			res.render('video',{
				title: '视频具体信息页',
				videoInf : videoInf,
				categoryVideoList : categoryVideoList
			});
		});
	});
});
module.exports = router;
