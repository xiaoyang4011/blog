var _ = require('lodash'),
	crypto = require("crypto"),
	config =  require('./../config');


function sha1(str){
	var md5sum = crypto.createHash("sha1");
	md5sum.update(str);
	str = md5sum.digest("hex");
	return str;
}
/**
 * 微信认证
 * @param req
 * @param res
 */
function wechatAuth(req, res){
	var query = req.query,
		signature = query.signature || '',
		echostr = query.echostr || '',
		timestamp = query['timestamp'] || '',
		nonce = query.nonce || '',
		oriArray = new Array();

	oriArray[0] = nonce,
	oriArray[1] = timestamp;
	oriArray[2] = "e574f89de1fb4d977c3bddcfce3ab640";
	oriArray.sort();
	var original = oriArray.join('');

	var scyptoString = sha1(original);

	if(signature == scyptoString){
		res.end(echostr);
		console.log("Confirm and send echo back");
	}else {
		res.end("false");
		console.log("Failed!");
	}
}

_.extend(
	module.exports,
	{
		wechatAuth : wechatAuth
	}
);