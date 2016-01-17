var mongoose = require('mongoose');
	autoIncrement = require('mongoose-auto-increment'),
	config = require('./../config'),
	merge = require('mongoose-merge-plugin');

var options = {
	server: {poolSize:100},
	user: config.db_user,
	pass: config.db_pass
};

var uri = config.db;

mongoose.connect(uri, options);
autoIncrement.initialize(mongoose.connection);

mongoose.plugin(merge);

mongoose.connection.on('error', function(err){
	console.log('connection mongodb err' + err);

	process.exit(1);
});

module.exports = mongoose;
