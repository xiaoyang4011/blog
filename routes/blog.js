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
router.get('/tags', auth.userRequired, Blog.tags);
router.get('/add_tag', auth.userRequired, Blog.add_tag);
router.post('/save_tag', auth.userRequired, Blog.save_tag);
router.get('/edit_tag', auth.userRequired, Blog.edit_tag);
router.get('/upload', Blog.uploadFile);
router.get('/uptoken', Blog.upToken);
router.get('/file_list', Blog.FileList);

module.exports = router;