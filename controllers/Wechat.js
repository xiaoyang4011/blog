var _ = require('lodash'),
	//crypto = require("crypto"),
	config =  require('./../config'),
	wechat = require('wechat');

//var config = {
//	token: config.wechat.Token,
//	appid: config.wechat.AppID,
//	encodingAESKey: config.wechat.EncodingAESKey
//};

//function sha1(str){
//	var md5sum = crypto.createHash("sha1");
//	md5sum.update(str);
//	str = md5sum.digest("hex");
//	return str;
//}
///**
// * 微信认证
// * @param req
// * @param res
// */
//function wechatAuth(req, res){
//	var query = req.query,
//		signature = query.signature || '',
//		echostr = query.echostr || '',
//		timestamp = query.timestamp || '',
//		nonce = query.nonce || '',
//		oriArray = [];
//
//	oriArray[0] = nonce;
//	oriArray[1] = timestamp;
//	oriArray[2] = "e574f89de1fb4d977c3bddcfce3ab640";
//	oriArray.sort();
//	var original = oriArray.join('');
//
//	var scyptoString = sha1(original);
//
//	if(signature == scyptoString){
//		res.end(echostr);
//		console.log("Confirm and send echo back");
//	}else {
//		res.end("false");
//		console.log("Failed!");
//	}
//}

exports.wechatAPI = wechat(config.wechat.Token, function(req, res, next){
	var message = req.weixin;

	if (message.FromUserName === '呵呵') {

		res.reply('呵呵你妹');
	}
	if((message.MsgType == 'event') && (message.Event == 'subscribe')){
		res.reply('关注个毛啊');
	}

	return next();
});
