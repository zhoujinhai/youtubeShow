(function ($) {
	"use strict";
	function pitchScale(){
	 //数据处理
      var data = [];
      var dataText = [];
      var views = $('#videoInformation .video-views').text().trim();
      data.push(Number( $('#videoInformation .supports').text()));
      data.push(Number( $('#videoInformation .opposes').text()));
     
      dataText.push( $('#videoInformation .video-support').text().trim());
      dataText.push( $('#videoInformation .video-oppose').text().trim());

      //画布大小
      var width = 400; 
      var height = 400;
      var svg = d3.select('#video-scale-draw')
            .append('svg')
            .attr('width',width)
            .attr('height',height);
      //布局
      var pie = d3.layout.pie();
      //转换数据
      var piedata = pie(data);

      var outerRadius = 150;  //外半径
      var innerRadius = 0;  //内半径，为0则中间没有空白

      var arc = d3.svg.arc()  //弧生成器
            .innerRadius(innerRadius) //设置内半径
            .outerRadius(outerRadius);  //设置外半径
      
      var color = d3.scale.category10();

      var arcs = svg.selectAll('g')
            .data(piedata)
            .enter()
            .append('g')
            .attr("transform","translate("+ (width/2) +","+ (height/2) +")");

      arcs.append('path')
        .attr('fill',function(d,i){
            return color(i);
        })
        .attr('d',function(d){
            return arc(d);
        });

      arcs.append("text")
        .attr("transform",function(d){
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor","middle")
        .data(dataText)
        .text(function(d){
            return d;
        });

      //给图表添加一个标题
      svg.append("text")
          .attr("x", (width/2))
          .attr("y", (30) )
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .style('font-weight',600)
          .text('视频'+views);
	}

	$(document).ready(function(){
        setTimeout(function(){
        	pitchScale();
        },100);
	});
    
   
}(jQuery));
