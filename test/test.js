var should = require('should');
var supertest = require('supertest');
var express = require('express');
var app = express();
var request = supertest(app);
var common = require('./../common/common');


describe('test web home', function(){
	it('test index', function(done){
		request.get('/')
				.end(function(err, res) {
					should.not.exist(err);
					done();
			});
	});

	it('test login', function(){
		request.post('/login')
				.type('form')
				.send({name : 'aaa', password : 121})
				.end(function(err, res){


					should.not.exist(err);
					done();
			});
	})

	it('test time format function', function(done){
		var without_html_code = '登录';

		var code = common.removeHTMLTag('<td><a href="/login">登录</a></td>');

		should.equal(without_html_code, code);

		done();
	});
});
