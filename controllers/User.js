var _ = require('lodash'),
	User = require('./../models/user_model'),
	trimBody = require('trim-body');

function login(req, res){
	return res.render('user/login');
}

function do_login(req, res){
	trimBody(req.body);

	var body = req.body,
		name = body.name,
		pass = body.password;

	User.Model.findOne({
		name : name,
		pass : pass
	},function(err, user){
		if(err){
			return res.renderError('服务器错误');
		}

		if(!user){
			return res.renderError('账号密码不匹配');
		}

		req.session.user = user;

		return res.redirect('/');
	});
}

function reg(req, res){
	return res.render('user/reg');
}

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

	User.Model.create(save_date, function(err){
		if(err){
			return res.renderError('服务器错误');
		}

		return res.redirect('/');
	});
}

_.extend(
	module.exports,
	{
		login       : login,
		do_login    : do_login,
		reg         : reg,
		do_reg      : do_reg
	}
);