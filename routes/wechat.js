var express = require('express');
var router = express.Router();
var Wechat = require('./../controllers/Wechat');

router.get('/book', Wechat.getBook);

module.exports = router;