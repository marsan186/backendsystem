process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_ENV = 'test';
let mongoose = require("mongoose");
let UserModel = require('../models/userModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
	beforeEach((done) => { //Before each test we empty the database
		UserModel.deleteMany({}, (err) => {
			done();
		});
	});
	/*
	 * Test the /GET route
	 */
	describe('/GET User', () => {
		it('it should GET all the users', (done) => {
			chai.request(server)
				.get('/user')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe('/POST user', () => {
		it('it should not POST a user without email_address field', (done) => {
			let user = {
				name: "Tes1",
				email_address: "test1@gmail.com",
				password: "test1",
				contact_number: '8959554551',
				active_status: true
			}
			chai.request(server)
				.post('/user')
				.send(user)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('email_address');
					done();
				});
		});

		it('it should POST a user ', (done) => {
			let user = {
				name: "Tes2",
				userName: "test2@gmail.com",
				password: "test2",
				contact_number: '5646545415',
				active_status: true
			}
			chai.request(server)
				.post('/user')
				.set('content-type', 'application/json')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('name');
					res.body.should.have.property('password');
					res.body.should.have.property('email_address');
					res.body.should.have.property('contact_number');
					res.body.should.have.property('active_status');
					done();
				});
		});

		it('it should POST a user login ', (done) => {
			let user = new UserModel({
				name: "demologin",
				email_address: "demologin@gmail.com",
				password: "demologin",
				contact_number: '849455561541',
				active_status: true
			});
			user.save((err, user) => {
				let login = {
					userName: "demologin@gmail.com",
					password: "demologin"
				};

				chai.request(server)
					.post('/user/login')
					.set('content-type', 'application/json')
					.send(login)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('token');

						done();
					});
			});
		});


		/*
	* Test the /GET/:id route
	*/
		describe('/GET/:id user', () => {

			it('it should GET a user by the given id', (done) => {
				let user = new UserModel({
					name: "demoltest",
					email_address: "demoltest@gmail.com",
					password: "demoltest",
					contact_number: '8778545454',
					active_status: true
				});
				user.save((err, user) => {
					let login = {
						userName: "demoltest@gmail.com",
						password: "demoltest"
					};

					chai.request(server)
						.post('/user/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {

							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;

							chai.request(server)
								.get('/user/' + user.id)
								.set('authorization', token)
								.send(user)
								.end((err, res) => {
									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('name');
									res.body.should.have.property('password');
									res.body.should.have.property('email_address');
									res.body.should.have.property('contact_number');
									res.body.should.have.property('active_status');
									res.body.should.have.property('_id').eql(user.id);
									done();
								});
						});

				});

			});
		});

		/*
		* Test the /PUT/:id route
		*/
		describe('/PUT/:id user', () => {
			it('it should UPDATE a user given the id', (done) => {
				let user = new UserModel({
					name: "demodata",
					email_address: "demodata45@gmail.com",
					password: "asdaasD",
					contact_number: '9451212111',
					active_status: true
				});

				user.save((err, user) => {

					let login = {
						userName: "demodata45@gmail.com",
						password: "asdaasD"
					};

					chai.request(server)
						.post('/user/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {

							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;

							chai.request(server)
								.put('/user/' + user._id)
								.set('content-type', 'application/json')
								.set('authorization', token)
								.send({
									name: "demodata",
									email_address: "demodata45@gmail.com",
									password: "asdaasD",
									contact_number: '565445454',
									active_status: true
								})
								.end((err, res) => {
									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('message').eql('User updated!');
									res.body.result.should.have.property('contact_number').eql('565445454');
									done();
								});
						});
				});
			});
		});

		/*
		* Test the /DELETE/:id route
		*/
		describe('/DELETE/:id user', () => {
			it('it should DELETE a user given the id', (done) => {
				let user = new UserModel({
					name: "test56",
					email_address: "test56@gmail.com",
					password: "test56",
					contact_number: '9754541123',
					active_status: true
				});

				user.save((err, user) => {

					let login = {
						userName: "test56@gmail.com",
						password: "test56"
					};

					chai.request(server)
						.post('/user/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;
							chai.request(server)
								.delete('/user/' + user._id)
								.set('authorization', token)
								.end((err, res) => {
									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('message').eql('User successfully deleted!');
									res.body.result.should.have.property('_id').eql(user.id);
									res.body.result.should.have.property('email_address').eql("test56@gmail.com");
									done();

								});
						});
				});
			});
		});

	});

});
