var _ = require('lodash'),
	User = require('./../models/user_model');

function login(req, res){
	return res.render('user/login');
}

function do_login(req, res){
	return res.render('user/login');
}

_.extend(
	module.exports,
	{
		login: login,
		do_login : do_login
	}
);