var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	mysql = require('mysql'),
	multer = require('multer');

var server = express();
var fileRouter = express.Router();
var loginRouter = express.Router();

server.listen(8020);
server.use(multer({dest:'./lib'}).any());

server.use('/file',fileRouter);
server.use('/login',loginRouter);

fileRouter.use('/upload',(req,res)=>{
	console.log(req.files);
	var newName = path.parse(req.files[0].originalname).ext
	fs.rename(req.files[0].path,req.files[0].path+newName,(err)=>{
		if( err ){
			res.send(err);
		}else{
			var Pool = mysql.createPool({
				'host': 'localhost',
				'user': 'root',
				'password': 'root',
				'database': 'wp'
			});
			Pool.getConnection((err,conn)=>{
				if( err ){
					res.send({'status': 0,'msg': '数据库连接失败'});
					conn.end();
				}else{
					
				}
			});
			res.send({status: 1,msg: '上传成功！'});
		}
	});
});

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
					res.send({'ok': 0,'msg': '用户名已占用'});
					conn.end();
				}else{
					conn.query('INSERT INTO `user` (`user`,`password`) VALUE("'+ req.query.user +'","'+ req.query.pass +'");',(err,data)=>{
						if(err){
							console.log(err);
							res.send({'ok': 0,'msg': '数据库连接失败'});
							conn.end();
						}else{
							conn.query(`CREATE TABLE ${req.query.user}
								(
									ID int(255) NOT NULL AUTO_INCREMENT,
									LastName varchar(255) NOT NULL,
									hashName varchar(255) NOT NULL,
									lastTime varchar(255) NOT NULL,
									size varchar(255) NOT NULL,
									download varchar(255) NOT NULL,
									PRIMARY KEY (ID)
							)`,(err,data)=>{
								if( err ){
									res.send(err);
								}else{
									res.send({'ok': 1,'msg': '恭喜您,注册成功!'});
								}
							});
							conn.end();
						}
					});
				}
			});
		}
	});
});

loginRouter.use('/login',(req,res)=>{
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
			conn.query('SELECT `user`,`password` FROM user WHERE user="'+ req.query.user +'";',(err,data)=>{
				if( data.length > 0 && req.query.pass == data[0].password ){
					res.send({'ok': 1,'msg': '欢迎回来！'});
				}else{
					res.send({'ok': 0,'msg': '用户名或密码错误！'});
				}
				conn.end();
			});
		}
	});
});


server.use('/',express.static('./'));