var express = require('express');
var router = express.Router();
var auth = require('./../middleware/auth');
var Blog = require('./../controllers/Blog');
var upload = require('./../lib/multer');

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
router.get('/upload', auth.userRequired, Blog.uploadFile);
router.get('/uptoken', auth.userRequired, Blog.upToken);
router.get('/file_list', auth.userRequired, Blog.FileList);
router.post('/record_file', auth.userRequired, Blog.recordFile);
router.get('/upload_test', Blog.uploadTest);
router.post('/do_upload_test', upload.single('image'), Blog.doUploadTest);

module.exports = router;