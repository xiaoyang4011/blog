var mongoose = require('../lib/mongoose'),
	Schema = mongoose.Schema,
	COLLECTION_NAME = 'tags',
	autoIncrement = require('mongoose-auto-increment'),
	_ = require('lodash');

var tagSchema = new Schema({
	//唯一自增ID
	tid: {
		type     : Number,
		required : true
	},
	name : {
		type     : String,
		required : true
	},
	st : {
		type     : Number,
		required : true,
		default  : 0
	},
	cts : {
		type       : Date,
		required   : true,
		default    : Date.now
	},
	pts : {
		type       : Date,
		required   : true,
		default    : Date.now
	}
});

tagSchema.index({tid: 1});
tagSchema.index({cts: 1});

tagSchema.plugin(autoIncrement.plugin, {
	model   : 'tags',
	field   : 'tid',
	startAt : 1
});

_.extend(
	module.exports,
	{
		Model: mongoose.model(COLLECTION_NAME, tagSchema)
	}
);