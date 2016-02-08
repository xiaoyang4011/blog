var express = require('express');
var router = express.Router();
var Wechat = require('./../controllers/Wechat');
var auth = require('./../middleware/auth');

router.get('/book', Wechat.getBook);
router.get('/create_menu', auth.userRequired, Wechat.createMenu);

module.exports = router;