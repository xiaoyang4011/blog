var express = require('express');
var router = express.Router();
var auth = require('./../middleware/auth');
var Blog = require('./../controllers/Blog');

router.get('/', Blog.index);
router.get('/add', auth.userRequired, Blog.add);
router.post('/do_save', auth.userRequired, Blog.doSave);
router.get('/detail', Blog.detail);
router.get('/edit', auth.userRequired, Blog.edit);
router.get('/about-me-edit', auth.userRequired, Blog.about_edit);
router.get('/about-me', Blog.about_me);

module.exports = router;