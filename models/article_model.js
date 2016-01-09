var mongoose = require('../lib/mongoose'),
	Schema = mongoose.Schema,
	COLLECTION_NAME = 'articles',
	autoIncrement = require('mongoose-auto-increment'),
	_ = require('lodash'),
	common = require('../common/common'),
	config = require('../config'),
	Seq = require('seq'),
	hljs = require('highlight.js');

var md = require('markdown-it')({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) {}

		return ''; // use external default escaping
	}
});

var articleSchema = new Schema({
	//唯一自增ID
	aid: {
		type: Number,
		required: true
	},
	title : {
		type       : String,
		required : true
	},
	tags : {
		type : Array
	},
	content : {
		type       : String,
		required : true
	},
	st : {
		type    : Number,
		required : true,
		default : 0
	},
	cts : {
		type       : Date,
		required : true,
		default    : Date.now
	}
});

articleSchema.index({aid: 1});
articleSchema.index({cts: 1});

articleSchema.plugin(autoIncrement.plugin, {
	model   : 'articles',
	field   : 'aid',
	startAt : 1
});

//-------------------虚拟属性-----------------------------

//文章内容 markdown->html
articleSchema.virtual('content_display').get(function(){
	return md.render(this.content);
});

//小标题
articleSchema.virtual('content_mini').get(function(){
	return common.removeHTMLTag(md.render(this.content)).substr(0, 100);
});

/**
 * list by page 分页查询
 * @param page
 * @param cb
 */
articleSchema.statics.list_by_page = function(page, cb){
	var Article = this,
		sort = {cts : -1},
		perpage = page * config.perpage_limit,
		skip = (page-1) * config.perpage_limit;

	new Seq()
		.seq('count', function () {
			Article.count(this);
		})
		.seq(function () {
			Article.find().sort(sort).skip(skip).limit(config.perpage_limit).exec(this);
		})
		.seq(function (articles) {
			var count = this.vars.count;

			return cb(null, {
				articles : articles,
				page     : page,
				next     : (perpage >= count) ? true : false
			});
		})
		.catch(function (err) {
			return cb(err);
		})
	;
}

_.extend(
	module.exports,
	{
		Model: mongoose.model(COLLECTION_NAME, articleSchema)
	}
);