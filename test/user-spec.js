process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../models/user');
const server = require('../server');

chai.use(chaiHttp);

describe('users', () => {
	beforeEach(done => {
        User.remove({}, (err) => {
        	if (err) return console.log(err);
           done();
        });
    });

	describe('get index', () => {

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
	
	describe('post user', () => {
		it('should post user successfully', done => {
			const user = {
				name: 'David Woolf',
				username: 'davidwoolf',
				email: 'test@example.com',
				password: 'password',
				passwordConfirmation: 'password'
			};
			
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
				    if (err) return res.json(err);
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('name').eql('David Woolf');
	                res.body.user.should.have.property('username').eql('davidwoolf');
	                res.body.user.should.have.property('email').eql('test@example.com');
	                res.body.user.should.have.property('isAdmin').eql(false);
					done();
				});
		});
		
		it('should throw password error', done => {
			const user = {
				name: 'David Woolf',
				username: 'davidwoolf',
				email: 'test@example.com',
				password: 'password',
				passwordConfirmation: 'password1'
			};
			
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
				    if (err) return res.json(err);
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('error').eql('Passwords do not match');
					done();
				});
		});
	});
});