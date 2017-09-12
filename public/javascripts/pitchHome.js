(function ($) {
	"use strict";
    //折线图

    function pitchHomeBrokenLine(){
       //画布大小
        // var w = document.getElementById('index-pitch-content').offsetWidth; 
        // var height = w*0.95;
        // var width = w*0.95;
        var height = 700;
        var width = 700;
        //数据处理
        var data = [];
        var channelOrder = [];
        var channelSub = [];
        var channelName = [];
        $('#channelList .channel-order').each(function(){
            channelOrder.push(Number($(this).text()));
        });

        $('#channelList .channel-subscriber').each(function(){
            channelSub.push(Number($(this).text()));
        });

        $('#channelList .channel-name').each(function(){
            channelName.push($(this).text());
        });
        
        for(var i=0;i<channelOrder.length;i++){
            data.push({channelOrder:channelOrder[i],channelSub:channelSub[i],channelName:channelName[i]});
        }
       
        
        //在 body 里添加一个 SVG 画布   
         var svg = d3.select("#index-pitch-content") 
          .append("svg")
          .attr("width", width) 
          .attr("height", height); 

        //画布周边的空白
        var padding = {left:50, right:30, top:60, bottom:40};
          
        //x轴的比例尺
        var xScale = d3.scale.ordinal()
          .domain(channelOrder)
          .rangeRoundBands([0, width - padding.left - padding.right]);

        //y轴的比例尺
        var yScale = d3.scale.linear()
          .domain([d3.min(data,function(d){
              return ((d.channelSub)/100000)-100;
            }),d3.max(data,function(d){
              return ((d.channelSub)/100000)+100;
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
          .text('排名')
          .attr("transform","translate(" + (width-padding.left-padding.right) + "," + 0 + ")");
          
        //添加y轴
        svg.append("g")
          .attr("class","y axis")
          .attr("transform","translate(" + padding.left + "," + padding.top + ")")
          .call(yAxis)
          .append('text')
          .text('订阅量/十万');

        //线条函数
        var line = d3.svg.line()
          .x(function(d) {return xScale(d.channelOrder); })
          .y(function(d) {return yScale((d.channelSub)/100000); })
          .interpolate('monotone');//线条在相邻两点的链接方式

        //将线条函数应用到path上
        var path = svg.append('path')
          .attr('d',line(data))
          .attr('class','line')
          .attr("transform","translate(" + (padding.left+(xScale(channelOrder[1]))/2) + "," + padding.top + ")")
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
          .attr("transform","translate(" + (padding.left+(xScale(channelOrder[1]))/2) + "," + padding.top + ")")
          .attr('r', 3.5)
          .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 6);
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
          });
          //添加提示框
          var tooltip = d3.select('#index-pitch-content')
              .append('div')
              .attr('class','tooltip')
              .style('opacity',0.0);

          g.on('mouseover',function(d){
                  tooltip.html(d.channelName+"的订阅量为"+'<br/>'
                             +d.channelSub+'<br/>'+"排名为"+d.channelOrder)
                       .style('left',(xScale(d.channelOrder)+(xScale(channelOrder[1]))/2)+"px")
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
              .text("订阅量折线图");

        };
//----------------------------------------------------------------------------- //
        //柱形图
        function pitchHomePillar(){
          //画布大小
          // var w = document.getElementById('index-pitch-content').offsetWidth; 
          // var height = w*0.95;
          // var width = w*0.95;
          var height = 700;
          var width = 700;
          //在 body 里添加一个 SVG 画布 
          var svg = d3.select("#index-pitch-content")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

          //画布周边的空白
          var padding = {left:50, right:30, top:60, bottom:40};

          //数据处理
            var data = [];
            var channelOrder = [];
            var channelSub = [];
            var channelName = [];
            $('#channelList .channel-order').each(function(){
                channelOrder.push(Number($(this).text()));
            });

            $('#channelList .channel-subscriber').each(function(){
                channelSub.push(Number($(this).text()));
            });

            $('#channelList .channel-name').each(function(){
                channelName.push($(this).text());
            });
            
            for(var i=0;i<channelOrder.length;i++){
                data.push({channelOrder:channelOrder[i],channelSub:channelSub[i],channelName:channelName[i]});
            }

          //定义一个数组
          var dataset = channelSub;
            
          //x轴的比例尺
          var xScale = d3.scale.ordinal()
            .domain(channelOrder)
            .rangeRoundBands([0, width - padding.left - padding.right]);

          //y轴的比例尺
            var yScale = d3.scale.linear()
              .domain([d3.min(data,function(d){
                  return ((d.channelSub)/100000)-100;
                }),d3.max(data,function(d){
                  return ((d.channelSub)/100000)+100;
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
            .attr("class","axis")
            .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis)
            .append('text')
            .text('排名')
            .attr("transform","translate(" + (width-padding.left-padding.right) + "," + 0 + ")");
              
          //添加y轴
          svg.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis)
            .append('text')
            .text('订阅量/十万');

          //矩形之间的空白
          var rectPadding = 4;

          //添加矩形元素
          var rects = svg.selectAll(".MyRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class","MyRect")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d){
              return xScale(d.channelOrder) + rectPadding/2;
            } )
            .attr("y",function(d){
              return yScale(d.channelSub/100000);
            })
            .attr("width", xScale.rangeBand() - rectPadding )
            .attr("height", function(d){
              return height - padding.top - padding.bottom - yScale(d.channelSub/100000)-1.5;
            })
            .attr("fill","steelblue")   //填充颜色不要写在CSS里
            .on("mouseover",function(d,i){
              d3.select(this)
                .attr("fill","#88a72b");
            })
            .on("mouseout",function(d,i){
              d3.select(this)
                .transition()
                    .duration(500)
                .attr("fill","steelblue");
            });

             //线条函数
            var line = d3.svg.line()
              .x(function(d) {return xScale(d.channelOrder) - rectPadding; })
              .y(function(d) {return yScale((d.channelSub)/100000); })
              .interpolate('monotone');//线条在相邻两点的链接方式

            //将线条函数应用到path上
            var path = svg.append('path')
              .attr('d',line(data))
              .attr('class','line')
              .attr("transform","translate(" + (padding.left+(xScale(channelOrder[1]))/2) + "," + padding.top + ")")
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
              .attr("transform","translate(" + (padding.left+(xScale(channelOrder[1]))/2) + "," + padding.top + ")")
              .attr('r', 3.5)
              .on('mouseover', function() {
                d3.select(this).transition().duration(500).attr('r', 6);
              })
              .on('mouseout', function() {
                d3.select(this).transition().duration(500).attr('r', 3.5);
              });

            //添加提示框
              var tooltip = d3.select('#index-pitch-content')
                  .append('div')
                  .attr('class','tooltip')
                  .style('opacity',0.0);

              rects.on('mouseover',function(d){
                      tooltip.html(d.channelName+"的订阅量为"+'<br/>'
                                 +d.channelSub+'<br/>'+"排名为"+d.channelOrder)
                           .style('left',(xScale(d.channelOrder)+(xScale(channelOrder[1]))/2)+"px")
                           .style('top',(d3.event.pageY-60)+"px")
                           .style('opacity',1.0);
                      d3.select(this)
                        .attr("fill","#88a72b");
                  })
                  .on('mousemove',function(){
                      tooltip.style('top',(d3.event.pageY-60)+"px")
                           .style('opacity',1.0);
                  })
                  .on('mouseout',function(d){
                    tooltip.style('opacity',0.0);
                    d3.select(this)
                      .transition()
                      .duration(500)
                      .attr("fill","steelblue");
                  });

               g.on('mouseover',function(d){
                    tooltip.html(d.channelName+"的订阅量为"+'<br/>'
                               +d.channelSub+'<br/>'+"排名为"+d.channelOrder)
                         .style('left',(xScale(d.channelOrder)+(xScale(channelOrder[1]))/2)+"px")
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
                  .text("订阅量排名图");
        };
    
        function pitchAdmin(){
       //画布大小
        // var w = document.getElementById('index-pitch-content').offsetWidth; 
        // var height = w*0.95;
        // var width = w*0.95;
        var height = 700;
        var width = 700;
        //数据处理
        var data = [];
        var channelSub = [];
        var channelName = [];
       
        $('#channelList .channel-subscriber').each(function(){
            channelSub.push(Number($(this).text()));
        });

        $('#channelList .channel-name').each(function(){
            channelName.push($(this).text());
        });
        
        for(var i=0;i<channelName.length;i++){
            data.push({channelSub:channelSub[i],channelName:channelName[i]});
        }
        //如果订阅数大于1个
        if(channelName.length>1){
              //在 body 里添加一个 SVG 画布   
           var svg = d3.select("#index-admin") 
            .append("svg")
            .attr("width", width) 
            .attr("height", height); 

          //画布周边的空白
          var padding = {left:50, right:50, top:60, bottom:40};
            
          //x轴的比例尺
          var xScale = d3.scale.ordinal()
            .domain(channelName)
            .rangeRoundBands([0, width - padding.left - padding.right]);

          //y轴的比例尺
          var yScale = d3.scale.linear()
            .domain([d3.min(data,function(d){
                return ((d.channelSub)/100000)-100;
              }),d3.max(data,function(d){
                return ((d.channelSub)/100000)+100;
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
            .text('订阅号')
            .attr("transform","translate(" + (width-padding.left-padding.right) + "," + 0 + ")");
            
          //添加y轴
          svg.append("g")
            .attr("class","y axis")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis)
            .append('text')
            .text('订阅量/十万');

          //线条函数
          var line = d3.svg.line()
            .x(function(d) {return xScale(d.channelName); })
            .y(function(d) {return yScale((d.channelSub)/100000); })
            .interpolate('monotone');//线条在相邻两点的链接方式

          //将线条函数应用到path上
          var path = svg.append('path')
            .attr('d',line(data))
            .attr('class','line')
            .attr("transform","translate(" + (padding.left+(xScale(channelName[1]))/2) + "," + padding.top + ")")
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
            .attr("transform","translate(" + (padding.left+(xScale(channelName[1]))/2) + "," + padding.top + ")")
            .attr('r', 3.5)
            .on('mouseover', function() {
              d3.select(this).transition().duration(500).attr('r', 6);
            })
            .on('mouseout', function() {
              d3.select(this).transition().duration(500).attr('r', 3.5);
            });
            //添加提示框
            var tooltip = d3.select('#index-admin')
                .append('div')
                .attr('class','tooltip')
                .style('opacity',0.0);

            g.on('mouseover',function(d){
                    tooltip.html(d.channelName+"的订阅量为"+'<br/>'
                               +d.channelSub+'<br/>')
                         .style('left',(xScale(d.channelName)+(xScale(channelName[1]))/2)+"px")
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
                .text("订阅量折线图");
        }
        

        };


        $(document).ready(function(){
            // setTimeout(function(){
            // 	pitchHomeBrokenLine();
            // },100);
            setTimeout(function(){
              pitchHomePillar();
            },100);
            setTimeout(function(){
              pitchAdmin();
            },100);
        });

   
}(jQuery));

