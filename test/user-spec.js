process.env.NODE_ENV = 'test';

const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const User = require('../models/user');
const server = require('../server');

chai.use(chaiHttp);

describe('users', () => {
	let userJaneId = '';
	
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
			password: 'Password8!',
			passwordConfirmation: 'Password8!'
		};
		
		chai.request(server)
			.post('/users')
			.send(user)
			.end((err, res) => {
			    if (err) return err;
			    
			    res.body.user.name.should.eql('Jane Doe');
			    
			    // save userJaneId for later tests
			    userJaneId = res.body.user.id;
				done();
			});
    });

	describe('index', () => {

		it('should fetch list of users', done => {
			chai.request(server)
				.get('/users')
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
				.get(`/users/${userJaneId}`)
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
				password: 'Password8!',
				passwordConfirmation: 'Password8!'
			};
			
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.message.should.eql('User created');
					res.body.user.name.should.eql('John Doe');
	                res.body.user.username.should.eql('johndoe');
	                res.body.user.email.should.eql('johndoe@example.com');
	                res.body.user.isAdmin.should.eql(false);
					done();
				});
		});
		
		it('should throw passwords don\'t match error', done => {
			const user = {
				name: 'John Doe',
				username: 'johndoe',
				email: 'johndoe@example.com',
				password: 'Password8!',
				passwordConfirmation: 'Password8!1'
			};
			
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Passwords do not match');
					done();
				});
		});
		
		it('should throw password requirements error', done => {
			const user = {
				name: 'John Doe',
				username: 'johndoe',
				email: 'johndoe@example.com',
				password: 'Password8',
				passwordConfirmation: 'Password8'
			};
			
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character');
					done();
				});
		});
		
		it('should throw username exists error', done => {
			const user = {
				name: 'Jill Doe',
				username: 'janedoe',
				email: 'jilldoe@example.com',
				password: 'Password8!1',
				passwordConfirmation: 'Password8!2'
			};
			
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Username already exists');
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
				password: 'Password8!',
				passwordConfirmation: 'Password8!'
			};
			
			chai.request(server)
				.post('/users')
				.send(user)
				.end((err, res) => {
				    if (err) return err;
				    
				    res.body.user.name.should.eql('James Doe');
					done();
				});
	    });

		it('should update email', done => {
			chai.request(server)
				.put(`/users/${userJaneId}`)
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
		
		it('should throw passwords don\'t match error', done => {
			chai.request(server)
				.put(`/users/${userJaneId}`)
				.send({ password: 'Password8!1', passwordConfirmation: 'Password8!2' })
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Passwords do not match');
					done();
				});
		});
		
		it('should throw password requirements error', done => {
			
			chai.request(server)
				.put(`/users/${userJaneId}`)
				.send({ password: 'password8!1', passwordConfirmation: 'password8!1' })
				.end((err, res) => {
				    if (err) return err;
				    
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.error.should.eql('Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character');
					done();
				});
		});
		
		it('should throw username exists error', done => {
			chai.request(server)
				.put(`/users/${userJaneId}`)
				.send({ username: 'jamesdoe' })
				.end((err, res) => {
				    if (err) return err;
				    
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
				.delete(`/users/${userJaneId}`)
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