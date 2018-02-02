process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../models/user');
const server = require('../server');

let userId = '';

chai.use(chaiHttp);

describe('users', () => {
	beforeEach(done => {
        User.remove({}, (err) => {
        	if (err) return err;
           done();
        });
	});
	beforeEach(done => {
        const user = {
			name: 'Jane Doe',
			username: 'janedoe',
			email: 'janedoe@example.com',
			password: 'password',
			passwordConfirmation: 'password'
		};
		
		chai.request(server)
			.post('/user')
			.send(user)
			.end((err, res) => {
			    if (err) return err;
			    
			    res.body.user.name.should.eql('Jane Doe');
			    userId = res.body.user.id;
				done();
			});
    });

	describe('get index', () => {

		it('should fetch list of users', done => {
			chai.request(server)
				.get('/user')
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});
	
	describe('get user', () => {

		it('should fetch user by id', done => {
			chai.request(server)
				.get(`/user/${userId}`)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.name.should.eql('Jane Doe');
					res.body.username.should.eql('janedoe');
					res.body.email.should.eql('janedoe@example.com');
					res.body.isAdmin.should.eql(false);
					done();
				});
		});
	});
	
	describe('post user', () => {
		
		it('should post user successfully', done => {
			const user = {
				name: 'John Doe',
				username: 'johndoe',
				email: 'johndoe@example.com',
				password: 'password',
				passwordConfirmation: 'password'
			};
			
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.name.should.eql('John Doe');
	                res.body.user.username.should.eql('johndoe');
	                res.body.user.email.should.eql('johndoe@example.com');
	                res.body.user.isAdmin.should.eql(false);
					done();
				});
		});
		
		it('should throw password error', done => {
			const user = {
				name: 'John Doe',
				username: 'johndoe',
				email: 'johndoe@example.com',
				password: 'password',
				passwordConfirmation: 'password1'
			};
			
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Passwords do not match');
					done();
				});
		});
	});
});