var express = require('express');
var router = express.Router();
var User = require('./../controllers/User');

router.get('/reg', User.reg);
router.post('/reg', User.do_reg);
router.get('/login', User.login);
router.post('/login', User.do_login);

module.exports = router;