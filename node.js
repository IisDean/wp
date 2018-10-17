var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	mysql = require('mysql'),
	multer = require('multer');

var server = express();
var loginRouter = express.Router();

server.listen(8020);

server.use('/login',loginRouter);

loginRouter.use('/res',(req,res)=>{
	// console.log(req.query);
	var Pool = mysql.createPool({
		'host': 'localhost',
		'user': 'root',
		'password': 'root',
		'database': 'wp'
	});
	Pool.getConnection((err,conn)=>{
		if( err ){
			console.log(err);
			res.send({'ok': 0,'msg': '数据库连接失败'});
			conn.end();		
		}else{
			conn.query('SELECT user FROM `user` WHERE user="'+ req.query.user +'";',(err,data)=>{
				if( data.length > 0 ){
					res.sned({'ok': 0,'msg': '用户名已占用'});
					conn.end();
				}else{
					conn.query('INSERT INTO `user` (`user`,`password`) VALUE("'+ req.query.user +'","'+ req.query.pass +'");',(err,data)=>{
						if(err){
							console.log(err);
							res.send({'ok': 0,'msg': '数据库连接失败'});
						}else{
							res.send({'ok': 1,'msg': '恭喜您,注册成功!'});
						}
						conn.end();
					});
				}
			});
		}
	});
});


server.use('/',express.static('./'));