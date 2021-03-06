/**
 * 需要登录
 */
'use strict';

exports.userRequired = function (req, res, next) {
	if (!req.session || !req.session.user) {
		return res.renderError('您未登录');
	}

	next();
};
