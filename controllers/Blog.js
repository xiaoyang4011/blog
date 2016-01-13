var _ = require('lodash'),
	Article = require('./../models/article_model'),
	trimBody = require('trim-body');
/**
 * 首页
 * @param req
 * @param res
 * @returns res->view
 */
function index(req, res) {
	var query = req.query;

	query.page = query.page || 1;

	Article.Model.list_by_page(query, function(err, ArticleInfo){
		if(err) {
			return res.renderError('服务器错误');
		}

		return res.render('index', ArticleInfo);
	});
}
/**
 * 文章详情
 * @param req
 * @param res
 * @returns view
 */
function detail(req, res){
	var query = req.query,
		aid = query.id || 0,
		is_login = false;

	if(!aid) {
		return res.renderError('内容不存在');
	}

	Article.Model.findOne({aid : aid}, function(err, article){
		if(err) {
			return res.renderError('服务器错误');
		}

		if(!article) {
			return res.renderError('内容不存在');
		}

		if(req.session.admin){
			is_login = true;
		}

		return res.render('blog/show', {
			article : article,
			is_login : is_login
		});
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

function doSave(req, res){
	trimBody(req.body);

	var body = req.body,
		title = body.title || '',
		content = body.content || '',
		tags = body.tags,
		aid = body.aid;

	if(!title || !content){
		return res.render('blog/add');
	}

	var article = {
		title : title,
		content : content,
		tags : tags
	};

	if(aid){
		Article.Model.update({aid : aid}, {$set: article}, function(err, result){
			if(err){
				return res.renderError('服务器错误');
			}

			return res.redirect('/');
		});
	}else{
		Article.Model.create(article, function(err){
			if(err) {
				return res.renderError('服务器错误');
			}

			return res.redirect('/');
		});
	}

}

function edit(req, res){
	var query = req.query,
		aid = query.aid;

	if(!aid){
		return res.renderError('您请求的资源不见鸟~');
	}

	Article.Model.findOne({aid : +aid}, function(err, article){
		if(err){
			return res.renderError('您请求的资源不见鸟~');
		}

		return res.render('blog/edit', {article : article});
	});
}


_.extend(
	module.exports,
	{
		index       : index,
		add         : add,
		doSave      : doSave,
		detail      : detail,
		edit        : edit
	}
);