(function ($) {
	"use strict";
    //折线图
    function pitchGainBrokenLine(){
    	//画布大小 

        var width = 700; 
        var height = 700;
        //数据处理
        var data = [];
        var updateTime = [];
        var channelSub = [];
        var subChange = [];
        var gainDate = $('.gain-date').text();
        $('#channelList .update-time').each(function(){
            var timeMinute = ($(this).text().trim()).toString().substr(3, 2);
            var timeHour = ($(this).text().trim()).toString().substr(0, 2);
            if(Number(timeMinute)>=30){
              timeHour = (Number(timeHour)+1).toString();
              if(Number(timeHour)<10){
                timeHour = '0'+timeHour;
              }
            }
            updateTime.push(timeHour);
        });
        $('#channelList .channel-subscriber').each(function(){
            channelSub.push(Number($(this).text()));
        });

        $('#channelList .channel-sub-change').each(function(){
            subChange.push(Number($(this).text()));
        });
        
        for(var i=0;i<updateTime.length;i++){
            data.push({updateTime:updateTime[i],channelSub:channelSub[i],subChange:subChange[i]});
        }
       
        
        //在 body 里添加一个 SVG 画布   
         var svg = d3.select("#channel-gain-pitch-content") 
          .append("svg")
          .attr("width", width) 
          .attr("height", height); 

        //画布周边的空白
        var padding = {left:50, right:30, top:60, bottom:40};
          
        //x轴的比例尺
        var xScale = d3.scale.ordinal()
          .domain(updateTime)
          .rangeRoundBands([0, width - padding.left - padding.right]);

        //y轴的比例尺
        var yScale = d3.scale.linear()
          .domain([d3.min(data,function(d){
              return (d.subChange)-200;
            }),d3.max(data,function(d){
              return (d.subChange)+200;
          })])
          .range([height - padding.top - padding.bottom, 0]);

        //定义x轴
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");
          
        //定义y轴
        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

        //添加x轴
        svg.append("g")
          .attr("class","x axis")
          .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
          .call(xAxis)
          .append('text')
          .text('时间')
          .attr("transform","translate(" + (width-padding.left-padding.right) + "," + 0 + ")");
          
        //添加y轴
        svg.append("g")
          .attr("class","y axis")
          .attr("transform","translate(" + padding.left + "," + padding.top + ")")
          .call(yAxis)
          .append('text')
          .text('订阅变化量');

        //线条函数
        var line = d3.svg.line()
          .x(function(d) {return (xScale(d.updateTime)-3.5); })//减去圆点半径
          .y(function(d) {return yScale(d.subChange); })
          .interpolate('monotone');//线条在相邻两点的链接方式

        //将线条函数应用到path上
        var path = svg.append('path')
          .attr('d',line(data))
          .attr('class','line')
          .attr("transform","translate(" + (padding.left+(xScale(updateTime[1]))/2) + "," + padding.top + ")")
          .attr("stroke",'blue')
          .attr('stroke-width',2)
          .attr('fill','none');

        //添加坐标点
        var g = svg.selectAll('circle')
          .data(data)
          .enter()
          .append('g')
          .append('circle')
          .attr('class', 'linecircle')
          .attr('cx', line.x())
          .attr('cy', line.y())
          .attr("transform","translate(" + (padding.left+(xScale(updateTime[1]))/2) + "," + padding.top + ")")
          .attr('r', 3.5)
          .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 6);
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
          });
          //添加提示框
          var tooltip = d3.select('#channel-gain-pitch-content')
              .append('div')
              .attr('class','tooltip')
              .style('opacity',0.0);

          g.on('mouseover',function(d){
                  tooltip.html(d.updateTime+"时的订阅量为"+'<br/>'
                             +d.channelSub+'<br/>'+"变化量为"+d.subChange)
                       .style('left',(xScale(d.updateTime)+(xScale(updateTime[1]))/2)+"px")
                       .style('top',(d3.event.pageY-60)+"px")
                       .style('opacity',1.0);
                  d3.select(this).transition().duration(500).attr('r', 6);
              })
              .on('mouseout',function(d){
                tooltip.style('opacity',0.0);
                d3.select(this).transition().duration(500).attr('r', 3.5);
              });
          //给图表添加一个标题
          svg.append("text")
              .attr("x", (width/2))
              .attr("y", (padding.top/2) )
              .attr("text-anchor", "middle")
              .style("font-size", "18px")
              .style('font-weight',600)
              .text(gainDate+"订阅变化量折线图");
    };
    function pitchSevenGainBrokenLine(){
        //画布大小 
        var width = 700; 
        var height = 700;
        //数据处理
        var data = [];
        var updateTime = [];
        var channelSub = [];
        var subChange = [];
        $('#channelList .updateTime').each(function(){
            updateTime.push(($(this).text()).toString().substr(0, 7));
        });
        $('#channelList .channel-day-subscriber').each(function(){
            channelSub.push(Number($(this).text()));
        });

        $('#channelList .channel-day-sub-change').each(function(){
            subChange.push(Number($(this).text()));
        });
        
        for(var i=0;i<updateTime.length;i++){
            data.push({updateTime:updateTime[i],channelSub:channelSub[i],subChange:subChange[i]});
        }
       
        
        //在 body 里添加一个 SVG 画布   
         var svg = d3.select("#channel-seven-gain-pitch-content") 
          .append("svg")
          .attr("width", width) 
          .attr("height", height); 

        //画布周边的空白
        var padding = {left:50, right:30, top:60, bottom:40};
          
        //x轴的比例尺
        var xScale = d3.scale.ordinal()
          .domain(updateTime)
          .rangeRoundBands([0, width - padding.left - padding.right]);

        //y轴的比例尺
        var yScale = d3.scale.linear()
          .domain([d3.min(data,function(d){
              return (d.subChange)-200;
            }),d3.max(data,function(d){
              return (d.subChange)+200;
          })])
          .range([height - padding.top - padding.bottom, 0]);

        //定义x轴
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");
          
        //定义y轴
        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

        //添加x轴
        svg.append("g")
          .attr("class","x axis")
          .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
          .call(xAxis)
          .append('text')
          .text('时间')
          .attr("transform","translate(" + (width-padding.left-padding.right) + "," + 0 + ")");
          
        //添加y轴
        svg.append("g")
          .attr("class","y axis")
          .attr("transform","translate(" + padding.left + "," + padding.top + ")")
          .call(yAxis)
          .append('text')
          .text('订阅变化量');

        //线条函数
        var line = d3.svg.line()
          .x(function(d) {return xScale(d.updateTime); })
          .y(function(d) {return yScale(d.subChange); })
          .interpolate('monotone');//线条在相邻两点的链接方式

        //将线条函数应用到path上
        var path = svg.append('path')
          .attr('d',line(data))
          .attr('class','line')
          .attr("transform","translate(" + (padding.left+(xScale(updateTime[1]))/2) + "," + padding.top + ")")
          .attr("stroke",'blue')
          .attr('stroke-width',2)
          .attr('fill','none');

        //添加坐标点
        var g = svg.selectAll('circle')
          .data(data)
          .enter()
          .append('g')
          .append('circle')
          .attr('class', 'linecircle')
          .attr('cx', line.x())
          .attr('cy', line.y())
          .attr("transform","translate(" + (padding.left+(xScale(updateTime[1]))/2) + "," + padding.top + ")")
          .attr('r', 3.5)
          .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 6);
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
          });
          //添加提示框
          var tooltip = d3.select('#channel-seven-gain-pitch-content')
              .append('div')
              .attr('class','tooltip')
              .style('opacity',0.0);

          g.on('mouseover',function(d){
                  tooltip.html(d.updateTime+"的订阅量为"+'<br/>'
                             +d.channelSub+'<br/>'+"变化量为"+d.subChange)
                       .style('left',(xScale(d.updateTime)+(xScale(updateTime[1]))/2)+"px")
                       .style('top',(d3.event.pageY-60)+"px")
                       .style('opacity',1.0);
                  d3.select(this).transition().duration(500).attr('r', 6);
              })
              .on('mouseout',function(d){
                tooltip.style('opacity',0.0);
                d3.select(this).transition().duration(500).attr('r', 3.5);
              });
          //给图表添加一个标题
          svg.append("text")
              .attr("x", (width/2))
              .attr("y", (padding.top/2) )
              .attr("text-anchor", "middle")
              .style("font-size", "18px")
              .style('font-weight',600)
              .text("近七天订阅变化量折线图");
    }

    $(document).ready(function(){
    	setTimeout(function(){
    		pitchGainBrokenLine();
    	},100);
      setTimeout(function(){
        pitchSevenGainBrokenLine();
      },100);
    });

}(jQuery));