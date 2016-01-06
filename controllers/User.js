var _ = require('lodash'),
	User = require('./../models/user_model');

function reg(req, res){
	return res.render('reg');
}
_.extend(
	module.exports,
	{
		reg: reg
	}
);