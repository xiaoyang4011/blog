/**
 * This is a wrapper of request.
 * Reference: https://github.com/mikeal/request
 */
'use strict';
var _ = require('lodash'),
	request = require('request'),
	config = require('./../config');

var request_extend = request.defaults({timeout: config.api_timeout});


/**
 * 发送get请求
 * @param url 是完整的url，例如：'http://it-ebooks-api.info/v1/'
 * @param data 例如： {st: 100}
 * @param cb
 */
function request_get(url, data, cb){
	if(_.isFunction(data)){
		cb = data;
		data = {};
	}

	var request_options = {
		uri: url,
		method: 'GET',
		qs: data,
		json: true
	};

	request_extend(request_options, function(err, response, body) {
		return cb(err, body);
	});
}

/**
 * 发送post请求
 * @param url 是完整的url，例如：'http://it-ebooks-api.info/v1/search/php'
 * @param data 例如： {id: 100}
 * @param cb
 */
function request_post(url, data, cb){
	if(_.isFunction(data)){
		cb = data;
		data = {};
	}

	var request_options = {
		uri: url,
		method: 'POST',
		body: data,
		json: true
	};

	request_extend(request_options, function(err, response, body) {
		return cb(err, body);
	});
}

_.extend(module.exports, {
	request_extend: request_extend,
	request_get: request_get,
	request_post: request_post
});

