var _ = require('lodash'),
	config =  require('./../config'),
	wechat = require('wechat'),
	wechat_lib = require('./../lib/wechat'),
	Seq = require('seq'),
	ebooks = require('./../lib/ebooks');

var wechatAPI = wechat(config.wechat.Token, function(req, res, next){
	var message = req.weixin,
		inputMsg = message.Content;


	if((message.MsgType == 'event') && (message.Event == 'subscribe')){
		res.reply('感谢关注');
	}

	console.log(message);
	console.log(message.Event);
	console.log(message.MsgType);
	console.log('--------------------');



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
					}
				]
			},
			{
				"type" : "click",
				"name": "每日一句",
				key : "every_day"
			},
			{
				"name": "圈内新闻",
				"type": "click",
				"key": "news"
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

_.extend(
	module.exports,
	{
		wechatAPI       : wechatAPI,
		getBook         : getBook,
		createMenu      : createMenu
	}
);
