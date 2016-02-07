var _ = require('lodash'),
	config =  require('./../config'),
	wechat = require('wechat'),
	ebooks = require('./../lib/ebooks');

var wechatAPI = wechat(config.wechat.Token, function(req, res, next){
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

}
_.extend(
	module.exports,
	{
		wechatAPI       : wechatAPI,
		getBook         : getBook,
		createMenu      : createMenu
	}
);
