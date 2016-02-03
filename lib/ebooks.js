var _ = require('lodash'),
	config =  require('./../config'),
	request_api = require('./../common/request_api');


function search(key, cb){
	request_api.request_get(config.ebooks + 'search/' + key, {}, function(err, result){
		if(err){
			return cb(err);
		}

		return cb(null, result);
	});
}

_.extend(
	module.exports,
	{
		search : search
	}
);