var express = require('express'),
	router = express.Router(),
	User = require('./../controllers/User');

router.get('/reg', User.reg);

module.exports = router;