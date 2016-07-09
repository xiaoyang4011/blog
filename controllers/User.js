'use strict';

var _ = require('lodash'),
	User = require('./../models/user_model'),
	config =  require('./../config'),
	trimBody = require('trim-body');

/**
 * 登录view
 * @param req
 * @param res
 */
function login(req, res){
	return res.render('user/login');
}

/**
 * 登录
 * @param req
 * @param res
 */
function do_login(req, res){
	trimBody(req.body);

	var body = req.body,
		name = body.name,
		pass = body.password;

	User.findOneAsync({name : name, pass : pass}).then(function(user){
		if(!user){
			return res.renderError('账号密码不匹配');
		}

		req.session.user = user;

		return res.redirect('/');
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

/**
 * 注册view
 * @param req
 * @param res
 */
function reg(req, res){
	if(!config.is_open_reg){
		return res.renderError('尚未开放注册');
	}

	return res.render('user/reg');
}

/**
 * 注册
 * @param req
 * @param res
 */
function do_reg(req, res){
	trimBody(req.body);

	var body = req.body,
		name = body.name,
		password = body.password,
		password_confirm = body.password_confirm;

	if(!name || name.length < 5){
		return res.renderError('请输入用户名或用户名长度不够');
	}

	if(!password || password !== password_confirm){
		return res.renderError('请输入密码');
	}

	var save_date = {
		name : name,
		pass : password
	};

	User.createAsync(save_date).then(function(){
		return res.redirect('/');
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

/**
 * 退出登录
 * @param req
 * @param res
 */
function logout(req, res){
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, { path: '/' });
	res.redirect('/');
}

function resume(req, res) {
    return res.render('user/resume');
}

_.extend(
	module.exports,
	{
		login       : login,
		do_login    : do_login,
		reg         : reg,
		do_reg      : do_reg,
		logout      : logout,
    resume      : resume
	}
);
