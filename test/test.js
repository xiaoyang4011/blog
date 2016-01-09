var should = require('should');
var supertest = require('supertest');
var express = require('express');
var app = express();
var request = supertest(app);


describe('test web home', function(){
	it('test', function(done){
		request.get('/')
				.end(function(err, res) {
					console.log(err);
					should.not.exist(err);
					done();
			});
	});
});
