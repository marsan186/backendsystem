process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_ENV = 'test';
let mongoose = require("mongoose");
let VendorModel = require('../models/vendorModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Vendors', () => {
    beforeEach((done) => { //Before each test we empty the database
        VendorModel.deleteMany({}, (err) => {
            done();
        });
    });
	/*
	 * Test the /GET route
	 */
    describe('/GET vendor', () => {
        it('it should GET all the vendors', (done) => {
            chai.request(server)
                .get('/vendor')
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
    describe('/POST vendor', () => {
        it('it should not POST a vendor without username field', (done) => {
            let vendor = {
                restarunt_name: "Test",
                restarunt_address: "Vellore",
                restarunt_type: "Hotel",
                restarunt_id: "VE10145",
                restarunt_contact_number: "89898989",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                password: "test45"
            }

            chai.request(server)
                .post('/vendor')
                .send(vendor)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('user_name');
                    done();
                });
        });


        it('it should POST a vendor ', (done) => {
            let vendor = {
                restarunt_name: "Test",
                restarunt_address: "Vellore",
                restarunt_type: "Hotel",
                restarunt_id: "VE10145",
                restarunt_contact_number: "89898989",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test45",
                password: "test45"
            }
            chai.request(server)
                .post('/vendor')
                .set('content-type', 'application/json')
                .send(vendor)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('restarunt_name');
                    res.body.should.have.property('restarunt_address');
                    res.body.should.have.property('restarunt_type');
                    res.body.should.have.property('restarunt_id');
                    res.body.should.have.property('restarunt_contact_number');
                    res.body.should.have.property('restarunt_email');
                    res.body.should.have.property('restarunt_description');
                    res.body.should.have.property('restarunt_opening_time');
                    res.body.should.have.property('restarunt_closing_time');
                    res.body.should.have.property('user_name');
                    res.body.should.have.property('password');
                    done();
                });
        });



        it('it should POST a vendor login ', (done) => {
            let vendor = new VendorModel({
                restarunt_name: "Test 1",
                restarunt_address: "Vellore",
                restarunt_type: "Hotel",
                restarunt_id: "VF4522",
                restarunt_contact_number: "9855212121",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test58",
                password: "test58",
                active_status: true
            });
            vendor.save((err, admin) => {
                let login = { "data": { "user_name": "test58", "password": "test58" } };
                chai.request(server)
                    .post('/vendor/login')
                    .set('content-type', 'application/json')
                    .send(login)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        res.body.vendorresponse.should.have.property('user_name').eql("test58");
                        done();
                    });
            });
        });


		/*
	* Test the /GET/:Id route
	*/
        describe('/GET/:Id vendor', () => {

            it('it should GET a admin by the given id', (done) => {
                let vendor = new VendorModel({
                    restarunt_name: "Test 1",
                    restarunt_address: "Vellore",
                    restarunt_type: "Hotel",
                    restarunt_id: "VF4522",
                    restarunt_contact_number: "9855212121",
                    restarunt_email: "fsefood2019@gmail.com",
                    restarunt_description: "Good",
                    restarunt_opening_time: "9:00 am",
                    restarunt_closing_time: "10:00 pm",
                    user_name: "test89",
                    password: "test89",
                    active_status:true
                });
                vendor.save((err, vendor) => {

                    chai.request(server)
                        .get('/vendor/' + vendor.user_name)
                        .send(vendor)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('restarunt_name');
                            res.body.should.have.property('restarunt_address');
                            res.body.should.have.property('restarunt_type');
                            res.body.should.have.property('restarunt_id');
                            res.body.should.have.property('restarunt_contact_number');
                            res.body.should.have.property('restarunt_email');
                            res.body.should.have.property('restarunt_description');
                            res.body.should.have.property('restarunt_opening_time');
                            res.body.should.have.property('restarunt_closing_time');
                            res.body.should.have.property('user_name');
                            res.body.should.have.property('password');
                            res.body.should.have.property('_id').eql(vendor.id);
                            done();
                        });
                });

            });
        });

		/*
		* Test the /PUT/:username route
		*/
        describe('/PUT/:username vendor', () => {
            it('it should UPDATE a vendor given the username', (done) => {
                let vendor = new VendorModel({
                    restarunt_name: "Test 4",
                    restarunt_address: "Vellore",
                    restarunt_type: "Hotel",
                    restarunt_id: "VFG4555",
                    restarunt_contact_number: "545546565",
                    restarunt_email: "fsefood2019@gmail.com",
                    restarunt_description: "Good",
                    restarunt_opening_time: "8:00 am",
                    restarunt_closing_time: "11:00 pm",
                    user_name: "demo89",
                    password: "demo89",
                    active_status:true
                });

                vendor.save((err, vendor) => {
                    chai.request(server)
                        .put('/vendor/' + vendor.user_name)
                        .set('content-type', 'application/json')
                        .send({
                            restarunt_name: "Test 78",
                            restarunt_address: "Bangalore",
                            restarunt_type: "Hotel",
                            restarunt_id: "VFG4555",
                            restarunt_contact_number: "788787879",
                            restarunt_email: "fsefood2019@gmail.com",
                            restarunt_description: "Good",
                            restarunt_opening_time: "7:00 am",
                            restarunt_closing_time: "9:00 pm",
                            password: "demo89"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('msg').eql("updated successfully");
                            res.body.result.should.have.property('restarunt_contact_number').eql("788787879");
                            done();
                        });
                });
            });
        });

		/*
		* Test the /DELETE/:id route
		*/
        describe('/DELETE/:id vendor', () => {
            it('it should DELETE a vendor given the id', (done) => {
                let vendor = new VendorModel({
                    restarunt_name: "Test 78",
                    restarunt_address: "Coimbatore",
                    restarunt_type: "Hotel",
                    restarunt_id: "CHGF00001",
                    restarunt_contact_number: "7877879789",
                    restarunt_email: "fsefood2019@gmail.com",
                    restarunt_description: "Good",
                    restarunt_opening_time: "8:00 am",
                    restarunt_closing_time: "11:00 pm",
                    user_name: "comb5445",
                    password: "comb5445"
                });
                vendor.save((err, vendor) => {
                    chai.request(server)
                        .delete('/vendor/' + vendor.id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('Vendor successfully deleted!');
                            res.body.result.should.have.property('_id').eql(vendor.id);
                            res.body.result.should.have.property('user_name').eql("comb5445");
                            done();
                        });
                });
            });
        });


    });


});
