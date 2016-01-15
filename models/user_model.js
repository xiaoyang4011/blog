var mongoose = require('../lib/mongoose'),
	Schema = mongoose.Schema,
	COLLECTION_NAME = 'users',
	autoIncrement = require('mongoose-auto-increment'),
	_ = require('lodash');

var userSchema = new Schema({
	//唯一自增ID
	uid: {
		type: Number,
		required: true
	},
	name : {
		type       : String,
		required : true
	},
	pass : {
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
	},
	pts : {
		type       : Date,
		required : true,
		default    : Date.now
	}
});

userSchema.index({uid: 1});
userSchema.index({cts: 1});

userSchema.plugin(autoIncrement.plugin, {
	model   : 'users',
	field   : 'uid',
	startAt : 1
});

_.extend(
	module.exports,
	{
		Model: mongoose.model(COLLECTION_NAME, userSchema)
	}
);