var _ = require('lodash'),
	config =  require('./../config'),
	wechat = require('wechat'),
	wechat_lib = require('./../lib/wechat'),
	Seq = require('seq'),
	ebooks = require('./../lib/ebooks');

var wechatAPI = wechat(config.wechat.Token, function(req, res, next){
	var message = req.weixin,
		inputMsg = message.Content,
		eventKey = message.EventKey;

	if((message.MsgType == 'event') && (message.Event == 'subscribe')){
		res.reply('感谢关注');
	}

	if((message.MsgType == 'event') && (message.Event == 'CLICK')){
		if(eventKey === 'every_day' || eventKey === 'news'){
			res.reply('暂未开放,敬请期待');
		}else if(eventKey === 'find'){
			res.reply('如果您需要查找图书请直接输入关键字,如:java(暂不支持中文)');
		}else if(eventKey === 'joke'){
			wechat_lib.get_joke(function(err, result){
				if (err) {
					res.reply('您的请求上天了');

					return next();
				}

				res.reply(result);

				return next();
			});
		}else {
			inputMsg = eventKey;
		}
	}

	if(inputMsg){
		ebooks.search(inputMsg, function(err, result){
			if (err) {
				res.reply('您的请求上天了');

				return next();
			}

			var books= result.Books || [];

			var replyBooks = _.map(books, function(book){
				var replyBook = {};

				replyBook.title = book.Title;
				replyBook.description = book.Description;
				replyBook.picurl = book.Image;
				replyBook.url = 'http://www.7csa.com/book?bid='+ book.ID;

				return replyBook;
			});

			res.reply(replyBooks);

			return next();
		});
	} else {
		return next();
	}

});

/**
 * 获取图书详情
 * @param req
 * @param res
 */
function getBook(req, res){
	var query = req.query,
		bid = query.bid;

	ebooks.book(bid, function(err, book){
		if(err){
			return res.renderError('您的请求上天了');
		}

		return res.render('wechat/book', {book : book});
	});
}

/**
 * 创建菜单
 * @param req
 * @param res
 */
function createMenu(req, res){
	var menu = {
		"button": [
			{
				"name": "热门书籍",
				"sub_button": [
					{
						"type": "click",
						"name": "JavaScript",
						"key": "javascript"
					},
					{
						"type": "click",
						"name": "PHP",
						"key": "php"
					},
					{
						"type": "click",
						"name": "MySql",
						"key": "mysql"
					},
					{
						"type": "click",
						"name": "其他",
						"key": "find"
					}
				]
			},
			{
				"type" : "click",
				"name": "每日一句",
				key : "every_day"
			},
			{
				"name": "老黄历",
				"type": "view",
				"url" :"http://sandbox.runjs.cn/show/ydp3it7b/"
			}
		]
	};

	new Seq()
		.seq(function(){
			wechat_lib.token(this);
		})
		.seq(function(token){
			wechat_lib.menu_create(token, menu, function(err){
				if(err) {
					return res.renderError('创建菜单错误');
				}

				return res.redirect('/');
			});
		})
		.catch(function(err){
			return res.renderError('创建菜单错误' + err);
		})
	;
}
/**
 * 推送消息
 * @param req
 * @param res
 */
function pushMsg(req, res) {

}


_.extend(
	module.exports,
	{
		wechatAPI       : wechatAPI,
		getBook         : getBook,
		createMenu      : createMenu,
		pushMsg         : pushMsg
	}
);
