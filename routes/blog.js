var express = require('express');
var router = express.Router();
var auth = require('./../middleware/auth');
var Blog = require('./../controllers/Blog');

router.get('/', Blog.index);
router.get('/add', auth.userRequired, Blog.add);
router.post('/do_save', auth.userRequired, Blog.doSave);
router.get('/detail', Blog.detail);
router.get('/edit', auth.userRequired, Blog.edit);

module.exports = router;