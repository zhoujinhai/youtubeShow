(function ($) {
	"use strict";
//the function of backTop button
		function backTop(){
		    $("#backTop").hide();//hide the button
			$(function(){
			   $(window).scroll(function(){
			       if($(this).scrollTop()>200){
				      $("#backTop").fadeIn();
				   }else{
				      $("#backTop").fadeOut();
				   }
			   });
			});

			$("#backTop a").click(function(){
			    $("html,body").animate({scrollTop:0},600);//set the speed of backTop
				return false;
			});
		}

		 // //记住用户名密码
		 //  function Save() {
		 //    if ($("#remember").attr("checked")) {
		 //      var str_username = $("#username").val();
		 //      var str_password = $("#password").val();
		 //      $.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie
		 //      $.cookie("username", str_username, { expires: 7 });
		 //      $.cookie("password", str_password, { expires: 7 });
		 //    }
		 //    else {
		 //      $.cookie("rmbUser", "false", { expire: -1 });
		 //      $.cookie("username", "", { expires: -1 });
		 //      $.cookie("password", "", { expires: -1 });
		 //    }
		 //  };

		// function searchChannel(){
		// 	$('#name').on('input',function(){
		// 	  search();
		// 	});
		// 	function search(){
		// 	    var result = $('#search-results');
		// 	    var search_key = $('#name').val();
		// 	    search_key = replaceIllegalStr(search_key); 
		//     }
		// 	//处理输入的内容
		// 	function replaceIllegalStr(str) {
		// 		var reg;
		// 		var illegal_list = ["/", "\\",
		// 		  "[", "]",
		// 		  "{", "}",s
		// 		  "<", ">",
		// 		  "＜", "＞",
		// 		  "「", "」",
		// 		  "：", "；",
		// 		  "、", "•",
		// 		  "^", "'", "\"",
		// 		  "\r", "\r\n", "\\n", "\n"];
		// 		for (var i = 0; i < illegal_list.length; i++) {
		// 		    if (str.indexOf(illegal_list[i]) >= 0) {
		// 			   if (illegal_list[i] == '\\' || illegal_list[i] == '[') {
		// 			    reg = new RegExp('\\' + illegal_list[i], "g");
		// 			   } else {
		// 			    reg = new RegExp(illegal_list[i], "g");
		// 			   }
		// 			   str = str.replace(reg, '');
		// 		    }
		// 		}
		// 		 return str.trim();
		// 	}
		// }

      

		//使通知框延时自动从页面删除
		function message(){
		  //延时清除成功或失败信息
		  if($('.ui.success.message').length>0){
		      $('.ui.success.message').fadeOut(3000)
		  }else if($('.ui.error.message').length>0){
		      $('.ui.error.message').fadeOut(3000)
		  }
		}

		function searchTable(){
			//设置列表查询
			$("#name").keyup(function () {
				$("table tbody tr").stop().hide() //将tbody中的tr都隐藏
				.filter(":contains('"+($(this).val())+"')").show(); //，将符合条件的筛选出来
			});
		}
   


		$(document).ready(function(){
		    backTop();
		    searchTable();
			message();
		});

})(jQuery);