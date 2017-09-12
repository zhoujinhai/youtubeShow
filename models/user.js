var mysql = require('mysql');
var DBName = 'youtube';

var pool = mysql.createPool({
   host : 'localhost',
   user : 'root',
   password : 'z2457098495924',
   database : 'youtube'
});

// pool.on('connection',function(connection){
//    connection.query('set session auto_increment_increment=1');
// });

function User(user){
   this.username = user.username;
   this.userpass = user.userpass;
   this.useremail = user.useremail;
   this.gender = user.gender;
};

module.exports = User;

pool.getConnection(function(err,connection){
   if(err) console.log(err);
   
   var useDbsql = "use " + DBName;
   
   connection.query(useDbsql,function(err){
   	  if(err){
   	  	console.log("use error:" + err.message);
   	    return;
   	  }	
   	  console.log(`use ${DBName} succeed!`);
   });

   //保存数据
   User.prototype.save = function save(callback){
   	var user = {
   	  	username: this.username,
   	  	userpass: this.userpass,
         useremail: this.useremail,
   	  	gender: this.gender
   	};

      pool.getConnection(function(err,connection){

      	var  insertUser_Sql= "insert into userinfo(username,userpass,useremail,gender) values(?,?,?,?)";
         
         connection.query(insertUser_Sql,[user.username,user.userpass,user.useremail,user.gender],function(err,result){
         	if(err){
         		console.log("insertUser_Sql error:" + err.message);
         		return;
         	}

         	connection.release();

         	console.log('inviked[save]');
         	callback(err,result);
         });
      });
   };

   //根据用户名得到用户数量
   User.getUserNumByName = function getUserNumByName(username,callback){
      pool.getConnection(function(err,connection){

         var getUserNumByName_Sql = "select count(1) as num from userinfo where username = ?";

         connection.query(getUserNumByName_Sql,[username],function(err,result){
            if(err){
            	console.log("getUserNumByName error:" + err.message);
            	return;
            }

            connection.release();

            console.log("invoked[getUserNumByName]");
            callback(err,result);
         });
      });
   };

   //根据邮箱得到用户数量
   User.getUserNumByEmail = function getUserNumByEmail(useremail,callback){
      pool.getConnection(function(err,connection){

         var getUserNumByEmail_Sql = "select count(1) as num from userinfo where useremail = ?";

         connection.query(getUserNumByEmail_Sql,[useremail],function(err,result){
            if(err){
               console.log("getUserNumByEmail error:" + err.message);
               return;
            }

            connection.release();

            console.log("invoked[getUserNumByEmail]");
            callback(err,result);
         });
      });
   };

   //根据用户名得到用户信息
   User.getuserByUserName = function getuserByUserName(username,callback){

      pool.getConnection(function(err,connection){

         var getuserByUserName_Sql = "select * from userinfo where username = ?";

         connection.query(getuserByUserName_Sql,[username],function(err,result){
            if(err){
               console.log("getuserByUserName error"+err.message);
               return;
            }
            connection.release();

            console.log("invoked[getuserByUserName]");
            callback(err,result);
         });
      });          
   };

   //根据用户名更改用户密码
   User.UpdateuserByUserName = function UpdateuserByUserName(username,password,callback){

      pool.getConnection(function(err,connection){

         var sql = "update userinfo set userpass=? where username = ?";

         connection.query(sql,[password,username],function(err,result){
            if(err){
               console.log("UpdateuserByUserName error"+err.message);
               return;
            }
            connection.release();

            console.log("invoked[UpdateuserByUserName]");
            callback(err);
         });
      });          
   };
   
   //根据用户名更改用户信息
   User.UpdateuserInf = function UpdateuserInf(username,inf,callback){

      pool.getConnection(function(err,connection){

         var sql = "update userinfo set username=?,gender=?,useremail=? where username = ?";

         connection.query(sql,[inf.rename,inf.regender,inf.reemail,username],function(err,result){
            if(err){
               console.log("UpdateuserInf error"+err.message);
               return;
            }
            connection.release();

            console.log("invoked[UpdateuserInf]");
            callback(err);
         });
      });          
   };
})