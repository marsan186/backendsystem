process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_ENV = 'test';
let mongoose = require("mongoose");
let AdminModel = require('../models/adminModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Admins', () => {
	beforeEach((done) => { //Before each test we empty the database
		AdminModel.deleteMany({}, (err) => {
			done();
		});
	});
	/*
	 * Test the /GET route
	 */
	describe('/GET admin', () => {
		it('it should GET all the admins', (done) => {
			chai.request(server)
				.get('/admin/list')
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
	describe('/POST admin', () => {
		it('it should not POST a admin without username field', (done) => {
			let admin = {
				name: "Testing",
				password: "demotest",
				contact_number: 8982512564,
				audit_user: "local",
				active_status: true,
				create_at: Date.now()
			}
			chai.request(server)
				.post('/admin/register')
				.send(admin)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('username');
					done();
				});
		});

		it('it should POST a admin ', (done) => {
			let admin = {
				name: "Testing",
				password: "demotest",
				user_name: "demotest",
				contact_number: 8982512564,
				active_status: true,
			}
			chai.request(server)
				.post('/admin/register')
				.set('content-type', 'application/json')
				.send(admin)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('name');
					res.body.should.have.property('password');
					res.body.should.have.property('username');
					res.body.should.have.property('contact_number');
					res.body.should.have.property('active_status');
					res.body.should.have.property('create_at');
					done();
				});
		});

		it('it should POST a admin login ', (done) => {
			let admin = new AdminModel({
				name: "Testinglogin",
				password: "demologin",
				username: "demologin",
				contact_number: 8795454541,
				audit_user: "local",
				active_status: true,
				create_at: Date.now()
			});
			admin.save((err, admin) => {
				let login = {
					user_name: "demologin",
					password: "demologin"
				};

				chai.request(server)
					.post('/admin/login')
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
		describe('/GET/:id admin', () => {

			it('it should GET a admin by the given id', (done) => {
				let admin = new AdminModel({
					name: "Testing2",
					password: "demotest2",
					username: "demotest2",
					contact_number: 879545454,
					audit_user: "local",
					active_status: true,
					create_at: Date.now()
				});
				admin.save((err, admin) => {

					let login = {
						user_name: "demotest2",
						password: "demotest2"
					};

					chai.request(server)
						.post('/admin/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;

							chai.request(server)
								.get('/admin/list/' + admin.id)
								.set('authorization', token)
								.send(admin)
								.end((err, res) => {

									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('name');
									res.body.should.have.property('password');
									res.body.should.have.property('username');
									res.body.should.have.property('contact_number');
									res.body.should.have.property('active_status');
									res.body.should.have.property('create_at');
									res.body.should.have.property('_id').eql(admin.id);
									done();
								});
						});
				});

			});
		});

		/*
		* Test the /PUT/:id route
		*/
		describe('/PUT/:id admin', () => {
			it('it should UPDATE a admin given the id', (done) => {
				let admin = new AdminModel({
					name: "Testing3",
					password: "demotest3",
					username: "demotest3",
					contact_number: 8982512564,
					audit_user: "local",
					active_status: true,
					create_at: Date.now()
				})
				admin.save((err, admin) => {
					let login = {
						user_name: "demotest3",
						password: "demotest3"
					};

					chai.request(server)
						.post('/admin/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;

							chai.request(server)
								.put('/admin/' + admin.id)
								.set('content-type', 'application/json')
								.set('authorization', token)
								.send({
									name: "Testing3",
									password: "demotest3",
									user_name: "demotest3",
									contact_number: 8787878754,
									audit_user: "local",
									active_status: true,
									create_at: Date.now()
								})
								.end((err, res) => {
									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('message').eql('Admin updated!');
									res.body.result.should.have.property('contact_number').eql(8787878754);
									done();
								});
						});
				});
			});
		});

		/*
		* Test the /DELETE/:id route
		*/
		describe('/DELETE/:id admin', () => {
			it('it should DELETE a admin given the id', (done) => {
				let admin = new AdminModel({
					name: "Testing6",
					password: "demotest6",
					username: "demotest6",
					contact_number: 9999999999,
					audit_user: "local",
					active_status: true,
					create_at: Date.now()
				})
				admin.save((err, admin) => {
					let login = {
						user_name: "demotest6",
						password: "demotest6"
					};

					chai.request(server)
						.post('/admin/login')
						.set('content-type', 'application/json')
						.send(login)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('token');
							let token = res.body.token;
							chai.request(server)
								.delete('/admin/' + admin.id)
								.set('authorization', token)
								.end((err, res) => {
									res.should.have.status(200);
									res.body.should.be.a('object');
									res.body.should.have.property('message').eql('Admin successfully deleted!');
									res.body.result.should.have.property('ok').eql(1);
									res.body.result.should.have.property('n').eql(1);
									done();
								});
						});
				});
			});
		});

	});

});
