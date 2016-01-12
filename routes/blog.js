var express = require('express');
var router = express.Router();
var Blog = require('./../controllers/Blog');

router.get('/', Blog.index);
router.get('/add', Blog.add);
router.post('/do_add', Blog.doAdd);
router.get('/detail', Blog.detail);
router.get('/edit', Blog.edit);

module.exports = router;