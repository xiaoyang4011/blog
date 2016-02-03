var _ = require('lodash'),
	config =  require('./../config'),
	wechat = require('wechat');

exports.wechatAPI = wechat(config.wechat.Token, function(req, res, next){
	var message = req.weixin;

	if (message.Content === '呵呵') {

		res.reply('呵呵你妹');
	}


	if((message.MsgType == 'event') && (message.Event == 'subscribe')){
		res.reply('关注个毛啊');
	}

	return next();
});
