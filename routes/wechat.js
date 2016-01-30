var express = require('express');
var router = express.Router();
var Wechat = require('./../controllers/Wechat');

router.get('/wechat_auth', Wechat.wechatAuth);

module.exports = router;
