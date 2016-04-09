'use strict';

var _ = require('lodash'),
	Article = require('./../models/article_model'),
	Tags = require('./../models/tags_model'),
	config = require('./../config'),
	qiniu = require('./../lib/qiniu'),
	moment = require('moment'),
	uptoken = new qiniu.rs.PutPolicy(config.qiniu.Bucket_Name),
	trimBody = require('trim-body'),
	co = require('co'),
	Promise = require('bluebird');

/**
 * 首页
 * @param req
 * @param res
 * @returns res->view
 */
function index(req, res) {
	var query = req.query;

	query.page = query.page || 1;

	co(function *() {

		var result = yield Article.list_by_page(query);

		var ArticleInfo = {
			articles: result[1],
			page: query.page,
			next: (query.page * config.perpage_limit >= result[0]) ? true : false
		};

		return res.render('index', ArticleInfo);
	}).catch(function (err) {
		console.log(err);
		return res.renderError('服务器错误');
	});
}
/**
 * 文章详情
 * @param req
 * @param res
 * @returns view
 */
function detail(req, res) {
	var query = req.query,
		aid = query.id || 0;

	if (!aid) {
		return res.renderError('内容不存在');
	}

	Article.findOneAsync({aid: aid}).then(function(article){
		return res.render('blog/show', {article: article});
	}).catch(function(err){
		return res.renderError('服务器错误');
	});
}

/**
 * 添加文章
 * @param req
 * @param req
 * @return view
 */
function add(req, res) {
	Tags.findAsync({st : 1}).then(function(tags){
		return res.render('blog/add', {tags: tags});
	}).catch(function(err){
		return res.renderError('服务器错误');
	});
}

function doSave(req, res) {
	trimBody(req.body);

	var body = req.body,
		title = body.title || '',
		content = body.content || '',
		tags = body.tags,
		aid = body.aid,
		fileMsg = req.file,
		extra = new qiniu.io.PutExtra(),
		token = uptoken.token(),
		uploadFile = Promise.promisify(qiniu.io.putFile, qiniu.io);

	if (!title || !content) {
		return res.render('blog/add');
	}

	var article = {
		title: title,
		content: content,
		tags: tags
	};

	co(function *(){
		if(fileMsg && fileMsg.filename){
			var fileInfo = yield uploadFile(token, fileMsg.filename, fileMsg.path, extra);
			article.image = _.get(fileInfo, 'key', '');
		}

		if(aid){
			yield Article.updateAsync({aid: aid}, {$set: article});
		}else{
			yield Article.createAsync(article);
		}

		return res.redirect('/');
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

function edit(req, res) {
	var query = req.query,
		aid = query.aid;

	if (!aid) {
		return res.renderError('您请求的资源不见鸟~');
	}

	co(function *(){
		var result = yield [
			Tags.findAsync({st : 1}),
			Article.findOneAsync({aid : +aid})
		];

		return res.render('blog/edit', {
			tags: result[0],
			article: result[1]
		});
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

function about_edit(req, res) {

	co(function *(){
		var aboutMe = yield Article.findOneAsync({type: 200}).sort({cts: -1});

		if (!aboutMe) {
			aboutMe = yield Article.createAsync({title: '关于', content: '关于', type: 200});
		}

		return res.render('blog/show', {article: aboutMe});
	}).catch(function(err){
		return res.renderError(err);
	});
}

function about_me(req, res) {
	Article.findOneAsync({type : 200}).sort({cts: -1}).then(function(article){
		if (!article) {
			return res.renderError('未找到个人页');
		}

		return res.render('blog/show', {article: article});
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

function tags(req, res) {
	Tags.findAsync().then(function(tags){
		return res.render('blog/tags', {tags: tags});
	}).catch(function(err){
		console.log(err);
		return res.renderError('服务器错误');
	});
}

/**
 * 添加tag页
 * @param req
 * @param res
 * @returns {*|String}
 */
function add_tag(req, res) {
	return res.render('blog/add_tag');
}

/**
 * 保存tag
 * @param req
 * @param res
 */
function save_tag(req, res) {
	trimBody(req.body);

	var body = req.body,
		name = body.name,
		status = body.status || 0,
		tid = body.tid;

	if (!name) {
		return res.renderError('名字不能为空');
	}

	var Tag = {
		name: name,
		st: status
	};

	co(function *(){
		if(tid){
			yield Tags.updateAsync({tid: tid}, {$set: Tag});
		}else{
			yield Tags.createAsync(Tag);
		}

		return res.redirect('/tags');
	}).catch(function(err){
		return res.renderError('服务器错误');
	});
}

function edit_tag(req, res) {
	trimBody(req.query);

	var query = req.query,
		tid = query.tid;

	if (!tid) {
		return res.renderError('您请求的资源不见鸟~');
	}

	Tags.findOneAsync({tid : +tid}).then(function(tag){
		return res.render('blog/edit_tag', {tag: tag});
	}).catch(function(err){
		return res.renderError('您请求的资源不见鸟~');
	});
}
/**
 * 上传文件页，返回domain, uptoken_url
 * @param req
 * @param res
 * @returns {*|String}
 */
function uploadFile(req, res) {

	return res.render('upload/index', {
		domain: config.qiniu.Domain,
		uptoken_url: config.qiniu.Uptoken_Url
	});
}

/**
 * 生成Token
 * @param req
 * @param res
 */
function upToken(req, res) {
	var token = uptoken.token();

	res.header("Cache-Control", "max-age=0, private, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	if (token) {
		res.json({
			uptoken: token
		});
	}
}

/**
 * 获取qiniu文件列表
 * @param req
 * @param res
 * @constructor
 */
function FileList(req, res) {
	qiniu.rsf.listPrefix(config.qiniu.Bucket_Name, '', null, 10, function (err, result) {
		if (err) {
			return res.renderError('服务器出现错误');
		}

		var file_list = result && result.items || [],
			files = _.map(file_list, function (file) {
				file.fsize = ((file.fsize) / 1024).toFixed(2) + 'KB';
				file.putTime = moment(parseInt(file.putTime / 10000)).format('YYYY-MM-DD HH:mm');

				return file;
			});

		return res.render('upload/file_list', {files: files});
	});
}

/**
 * 记录上传至七牛的文件
 * @param req
 * @param res
 * @returns {*}
 */
function recordFile(req, res) {
	var body = req.body;

	return res.json({code: 0});
}

function uploadTest(req, res) {
	return res.render('upload/upload');
}


function doUploadTest(req, res) {
	var fileMsg = req.file,
		extra = new qiniu.io.PutExtra(),
		token = uptoken.token();

	qiniu.io.putFile(token, fileMsg.filename, fileMsg.path, extra, function (err, ret) {
		if (err) {
			return res.renderError('服务器出现错误');
		}

		return res.redirect('/');
	});
}

_.extend(
	module.exports,
	{
		index: index,
		add: add,
		doSave: doSave,
		detail: detail,
		edit: edit,
		about_edit: about_edit,
		about_me: about_me,
		tags: tags,
		add_tag: add_tag,
		save_tag: save_tag,
		edit_tag: edit_tag,
		uploadFile: uploadFile,
		upToken: upToken,
		FileList: FileList,
		recordFile: recordFile,
		uploadTest: uploadTest,
		doUploadTest: doUploadTest
	}
);