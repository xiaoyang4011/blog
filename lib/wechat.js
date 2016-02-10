var _ = require('lodash'),
	config =  require('./../config'),
	request_api = require('./../common/request_api');

/**
 * 获取wechat的access_token
 * @param cb
 */
function token(cb){
	var data_condition = {
		grant_type : 'client_credential',
		appid : config.wechat.AppID,
		secret : config.wechat.AppSecret
	};

	request_api.request_get(config.wechat_api.token, data_condition, function(err, result){
		if(err){
			return cb(err);
		}

		return cb(null, result.access_token);
	});
}

/**
 * 创建菜单
 * @param menu_data
 * @param cb
 */
function menu_create(access_token, menu_data, cb){

	request_api.request_post(config.wechat_api.create_menu
		+ '?access_token=' + access_token, menu_data, function(err, ret){
			if(err) return cb(err);

			console.log(ret);

			return cb();
	});
}

/**
 * 获取笑话内容
 * @param cb
 */
function get_joke(cb){
	request_api.request_get(config.joke, {}, function(err, ret){
		if(err) {
			return cb(err);
		}

		return cb(null, ret);
	});
}

_.extend(
	module.exports,
	{
		token : token,
		menu_create : menu_create,
		get_joke : get_joke
	}
);