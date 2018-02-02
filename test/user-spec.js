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
		// clear DB
        User.remove({}, (err) => {
        	if (err) return err;
           done();
        });
	});
	
	beforeEach(done => {
		// add test user to DB
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
			    
			    // save userId for later tests
			    userId = res.body.user.id;
				done();
			});
    });

	describe('index', () => {

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
	
	describe('show', () => {

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
	
	describe('create', () => {
		
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
		
		it('should throw password error if passwords do not match', done => {
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
	
	describe('update', () => {
		
		beforeEach(done => {
			// add 2nd test user to DB
	        const user = {
				name: 'James Doe',
				username: 'jamesdoe',
				email: 'jamesedoe@example.com',
				password: 'password',
				passwordConfirmation: 'password'
			};
			
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
				    res.body.user.name.should.eql('James Doe');
					done();
				});
	    });

		it('should update email', done => {
			chai.request(server)
				.put(`/user/${userId}`)
				.send({ email: 'jane@example.com' })
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.message.should.eql('User updated');
					res.body.user.name.should.eql('Jane Doe');
					res.body.user.username.should.eql('janedoe');
					res.body.user.email.should.eql('jane@example.com');
					res.body.user.isAdmin.should.eql(false);
					done();
				});
		});
		
		it('should throw username exists error', done => {
			chai.request(server)
				.put(`/user/${userId}`)
				.send({ username: 'jamesdoe' })
				.end((err, res) => {
				    if (err) return err;
				    
				    console.log(res.body.user);
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Username already exists');
					done();
				});
		});
	});
	
	describe('delete', () => {

		it('should delete user', done => {
			chai.request(server)
				.delete(`/user/${userId}`)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.message.should.eql('User deleted');
					done();
				});
		});
	});
});