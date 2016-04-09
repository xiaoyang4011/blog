'use strict';

var config = {
	// mongodb 配置
	hostname: 'localhost',
	debug: true,
	db: 'mongodb://127.0.0.1/blog',
	db_user: 'db_user',
	db_pass: 'db_pass',
	// redis 配置，默认是本地
	redis_host: '127.0.0.1',
	redis_port: 6379,
	redis_db: 0,
	perpage_limit: 20,

	session_secret: 'node_7csa_secret', // 务必修改
	auth_cookie_name: 'node_7csa',

	// 程序运行的端口
	is_open_reg: true,
	port: 1500
};
module.exports = config;