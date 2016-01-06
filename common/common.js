var _ = require('lodash');

/**
 * 去掉html标签
 * @param str
 * @returns {string}
 */
function removeHTMLTag(str) {
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	return str;
}

_.extend(
	module.exports,
	{
		removeHTMLTag: removeHTMLTag
	}
);

