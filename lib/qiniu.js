var qiniu = require('qiniu'),
	config = require('./../config')

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

module.exports = qiniu;
