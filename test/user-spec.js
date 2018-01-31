process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../models/user');
const server = require('../server');

chai.use(chaiHttp);

describe('users', () => {

	describe('get users', () => {
		it('should fetch list of users', done => {
			chai.request(server)
				.get('/user')
				.end((err, res) => {
				    if (err) return res.json(err);
				    
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});
});