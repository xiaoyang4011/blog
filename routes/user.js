'use strict';

var express = require('express');
var router = express.Router();
var User = require('./../controllers/User');
var auth = require('./../middleware/auth');

router.get('/reg', User.reg);
router.post('/reg', User.do_reg);
router.get('/login', User.login);
router.post('/login', User.do_login);
router.post('/logout', auth.userRequired, User.logout);

module.exports = router;