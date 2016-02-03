var _ = require('lodash'),
	config =  require('./../config'),
	wechat = require('wechat'),
	ebooks = require('./../lib/ebooks');

exports.wechatAPI = wechat(config.wechat.Token, function(req, res, next){
	var message = req.weixin,
		inputMsg = message.Content;


	if((message.MsgType == 'event') && (message.Event == 'subscribe')){
		res.reply('感谢关注');
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
				replyBook.url = 'http://www.baidu.com/';

				return replyBook;
			});

			res.reply(replyBooks);

			return next();
		});
	} else {
		return next();
	}

});
