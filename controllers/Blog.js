var _ = require('lodash'),
	Article = require('./../models/article_model'),
	trimBody = require('trim-body'),
	config = require('../config')
	Seq = require('seq');

/**
 * 首页
 * @param req
 * @param res
 * @returns res->view
 */
function index(req, res) {
	var query = req.query,
		page = query.page || 1,
		sort = {cts : -1},
		perpage = page * config.perpage_limit,
		skip = (page-1) * config.perpage_limit;

	new Seq()
		.seq('count', function () {
			Article.Model.count(this);
		})
		.seq(function () {
			Article.Model.find().sort(sort).skip(skip).limit(config.perpage_limit).exec(this);
		})
		.seq(function (articles) {
			var count = this.vars.count;

			return res.render('index', {
				articles : articles,
				page     : page,
				next     : (perpage >= count) ? true : false
			});
		})
		.catch(function (err) {
			return res.renderError({err : err});
		})
	;

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