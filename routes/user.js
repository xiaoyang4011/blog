var express = require('express');
var router = express.Router();
var User = require('./../controllers/User');

router.get('/login', User.login);

module.exports = router;