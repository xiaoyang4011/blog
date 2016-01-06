var _ = require('lodash'),
	Article = require('./../models/article_model'),
	trimBody = require('trim-body');

/**
 * 首页
 * @param req
 * @param res
 * @returns res->view
 */
function index(req, res){
	Article.Model.find({}, {aid: 1, title: 1, content: 1, _id : 0}, function(err, articles){
		if(err) return res.renderError('服务器出错');

		return res.render('index', {articles : articles});
	});
}

/**
 * 添加文章
 * @param req
 * @param req
 * @return view
 */
function add(req, res){
	return res.render('blog/add');
}

function doAdd(req, res){
	trimBody(req.body);

	var body = req.body,
		title = body.title || '',
		content = body.content || '';

	if(!title || !content){
		return res.render('blog/add');
	}

	var article = {
		title : title,
		content : content,
		tags : [
			'node',
			'express'
		]
	};

	Article.Model.create(article, function(err){
		if(err) return res.renderError('服务器错误');

		res.redirect('/');
	});
}

function detail(req, res){
	return res.render('blog/show');
}

_.extend(
	module.exports,
	{
		index: index,
		add  : add,
		doAdd : doAdd,
		detail : detail
	}
);