var express = require('express');
var path = require('path');
var config = require('./config');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var RedisStore = require('connect-redis')(session);
var user = require('./routes/user');
var blog = require('./routes/blog');
var wechat = require('./routes/wechat');
var csurf = require('csurf');
var auth = require('./middleware/auth');
var errorPageMiddleware = require('./middleware/error_page');
var logger = require('./common/logger');
var log4js = require('log4js');
var moment = require('moment');
var lodash = require('lodash');
var wechatFun = require('./controllers/Wechat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
moment.locale('zh-cn');
app.locals.moment = moment;
app.locals._ = lodash;

//中间件
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
	secret: config.session_secret,
	store: new RedisStore({
	port: config.redis_port,
	host: config.redis_host
  }),
	resave: true,
	saveUninitialized: true
}));

app.use(errorPageMiddleware.errorPage);
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(/^\/(do|add)/, csurf());
app.use(function (req, res, next) {
	res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
	next();
});
app.use(function(req, res, next) {
	res.locals.user = null;

	if(req.session && req.session.user){
		res.locals.user = req.session.user;
	}

	next();
});
//应用路由
app.use('/', blog);
app.use('/', user);
app.use('/', wechat);
app.use('/wechat', wechatFun.wechatAPI);

if (!module.parent) {
	app.listen(config.port, function () {
		logger.info('Happy Hacking on port', config.port);
		logger.info('God bless love....');
		logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
		logger.info('');
	});
}

// 404错误处理
app.get('*', function(req, res){
	res.render('notify/404', {
		error: '404 您访问的页面不存在'
	});
});

module.exports = app;
