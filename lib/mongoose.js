var mongoose = require('mongoose');
	autoIncrement = require('mongoose-auto-increment'),
	merge = require('mongoose-merge-plugin');

var options = {
	server: {poolSize:100}
};

var uri = 'mongodb://localhost/blog';

mongoose.connect(uri, options);
autoIncrement.initialize(mongoose.connection);

mongoose.plugin(merge);

mongoose.connection.on('error', function(err){
	console.log('connection mongodb err' + err);

	process.exit(1);
});

module.exports = mongoose;
