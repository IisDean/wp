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
	var newName = path.parse(req.files[0].originalname).ext;
	var hashName = req.files[0].filename + path.parse(req.files[0].originalname).ext;
	var lastTime = new Date().toLocaleString();
	var size = (req.files[0].size/1024/1024).toFixed(2) +'M';
	console.log(size);
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
				console.log(req.body.userName);
				if( err ){
					console.log(err);
					res.send({'status': 0,'msg': '数据库连接失败'});
					conn.end();
				}else{
					conn.query('INSERT INTO `'+ req.body.userName +'` (`LastName`,`hashName`,`lastTime`,`size`,`download`) VALUES("'+ req.files[0].originalname +'","'+ hashName +'","'+ lastTime +'","'+ size+'","0");', (err)=>{
						if( err ){
							console.log(err);
							res.send({status: 0,msg: '数据库连接失败'});
						}else{
							res.send({status: 1,msg: '上传成功！',LastName: req.files[0].originalname,hashName: hashName,lastTime: lastTime,size: size});
						}	
						conn.end();				
					});				
				}
			});
		}
	});
});

//删除
fileRouter.use('/delete',(req,res)=>{
	console.log(req.query.hashName);
	var Pool = mysql.createPool({
		'host': 'localhost',
		'user': 'root',
		'password': 'root',
		'database': 'wp'
	});
	Pool.getConnection((err,conn)=>{
		if( err ){
			cosole.log(err);
			res.send({'status': 0, msg: '数据库连接失败'});
			conn.end();
		}else {
			conn.query('DELETE FROM `'+ req.query.userName +'` WHERE `hashName`="'+ req.query.hashName +'";',(err)=>{
				if( err ){
					console.log(err);
					res.send({'status': 0, msg: '数据库连接失败'});
					conn.end();
				}else{
					res.send({'status': 1, msg: '删除成功'});
					conn.end();
				}
			});
		}
	});
});

//注册
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

//登录
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
					conn.query('SELECT `LastName`,`lastTime`,`size`,`hashName` FROM `'+ req.query.user +'`', (err,data)=>{
						if( err ){
							console.log(err);
							res.send({'ok': 0,'msg': '数据查询失败'});
						}else {
							res.send({'ok': 1,'msg': '欢迎回来！', data: data});
						}
					});
				}else{
					res.send({'ok': 0,'msg': '用户名或密码错误！'});
					conn.end();
				}
			});
		}
	});
});


server.use('/',express.static('./'));