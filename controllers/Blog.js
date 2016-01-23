var _ = require('lodash'),
	Article = require('./../models/article_model'),
	Tags = require('./../models/tags_model'),
	Seq = require('seq'),
	tags_lib = require('./../lib/tags'),
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
		aid = query.id || 0;

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

		return res.render('blog/show', {article : article});
	});
}

/**
 * 添加文章
 * @param req
 * @param req
 * @return view
 */
function add(req, res){
	return res.render('blog/add', {tags : tags_lib.tags});
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

function about_edit(req, res){
	new Seq()
		.seq(function(){
			Article.Model.findOne({type : 200}).sort({cts : -1}).exec(this);
		})
		.seq(function(article){
			var that = this;

			if(article){
				return that(null, article);
			}

			Article.Model.create({
				title : '关于',
				content : '关于',
				type : 200
			}, this);
		})
		.seq(function(article){
			return res.render('blog/show', {article : article});
		})
		.catch(function (err) {
			return res.renderError(err);
		})
	;
}

function about_me(req, res){
	Article.Model.findOne({type : 200}).sort({cts : -1})
		.exec(function(err, article){
			if(err){
				return res.renderError('服务器错误');
			}

			if(!article){
				return res.renderError('未找到个人页');
			}

			return res.render('blog/show', {article : article});
	});
}

function tags(req, res){
	Tags.Model.find(function(err, tags){
		if(err) {
			return res.renderError('服务器错误');
		}

		return res.render('blog/tags', {tags : tags});
	});
}

/**
 * 添加tag页
 * @param req
 * @param res
 * @returns {*|String}
 */
function add_tag(req, res){
	return res.render('blog/add_tag');
}

/**
 * 保存tag
 * @param req
 * @param res
 */
function save_tag(req, res){
	trimBody(req.body);

	var body = req.body,
		name = body.name,
		status = body.status || 0,
		tid = body.tid;

	if(!name){
		return res.renderError('名字不能为空');
	}

	var Tag = {
		name : name,
		st : status
	};

	if(tid){
		Tags.Model.update({tid : tid}, {$set: Tag}, function(err){
			if(err){
				return res.renderError('服务器错误');
			}

			return res.redirect('/tags');
		});
	}else{
		Tags.Model.create(Tag, function(err){
			if(err) {
				return res.renderError('服务器错误');
			}

			return res.redirect('/tags');
		});
	}
}

function edit_tag(req, res){
	trimBody(req.query);

	var query = req.query,
		tid = query.tid;

	if(!tid){
		return res.renderError('您请求的资源不见鸟~');
	}

	Tags.Model.findOne({tid : +tid}, function(err, tag){
		if(err){
			return res.renderError('您请求的资源不见鸟~');
		}

		return res.render('blog/edit_tag', {tag : tag});
	});
}

_.extend(
	module.exports,
	{
		index       : index,
		add         : add,
		doSave      : doSave,
		detail      : detail,
		edit        : edit,
		about_edit  : about_edit,
		about_me    : about_me,
		tags        : tags,
		add_tag     : add_tag,
		save_tag    : save_tag,
		edit_tag    : edit_tag
	}
);