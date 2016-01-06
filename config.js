var config = {
	// mongodb 配置
	hostname: 'localhost',
	debug: true,
	db: 'mongodb://127.0.0.1/blog',
	// redis 配置，默认是本地
	redis_host: '127.0.0.1',
	redis_port: 6379,
	redis_db: 0,

	session_secret: 'node_7csa_secret', // 务必修改
	auth_cookie_name: 'node_7csa',

	// 程序运行的端口
	port: 1500
};
module.exports = config;