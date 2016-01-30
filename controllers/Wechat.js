var _ = require('lodash'),
	config =  require('./../config');


/**
 * 微信认证
 * @param req
 * @param res
 */
function wechatAuth(req, res){
	var query = req.query,
		echostr = query.echostr || '';

	return res.json({echostr : echostr});
}

_.extend(
	module.exports,
	{
		wechatAuth : wechatAuth
	}
);