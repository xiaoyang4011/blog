/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
	if (!req.session || !req.session.user) {
		return res.status(403).send('forbidden!');
	}

	next();
};
