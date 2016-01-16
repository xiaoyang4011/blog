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
var csurf = require('csurf');
var auth = require('./middleware/auth');
var errorPageMiddleware = require('./middleware/error_page');
var logger = require('./common/logger');
var log4js = require('log4js');
var moment = require('moment');
var lodash = require('lodash');

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
app.locals.user = null;

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

//检查登陆的中间件
//app.use(auth.userRequired);
app.use(errorPageMiddleware.errorPage);

//app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(csurf());
app.use(function (req, res, next) {
	res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
	next();
});
app.use(function(req, res, next) {
	if(req.session && req.session.user){
		app.locals.user = req.session.user;
	}

	next();
});
//应用路由
app.use('/', blog);
app.use('/', user);

if (!module.parent) {
	app.listen(config.port, function () {
		logger.info('Happy Hacking on port', config.port);
		logger.info('God bless love....');
		logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
		logger.info('');
	});
}

// 404错误处理
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// 生产环境，500错误处理
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
