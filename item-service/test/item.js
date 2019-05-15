process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_ENV = 'test';
let mongoose = require("mongoose");
let ItemsModel = require('../models/itemsModel');
let VendorModel = require('./vendorModel');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Items', () => {
    beforeEach((done) => { //Before each test we empty the database
        ItemsModel.deleteMany({}, (err) => {
            done();
        });
    });
	/*
	 * Test the /GET route
	 */
    describe('/GET:vendorid Items', () => {
        it('it should GET all the Items by vendorid', (done) => {
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
                chai.request(server)
                    .get('/items/getitems/' + admin._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(0);
                        done();
                    });
            });
        });
    });

	/*
  * Test the /POST route
  */
    describe('/POST user', () => {
        it('it should not POST a user without Item Name field', (done) => {

            let vendor = new VendorModel({
                restarunt_name: "Test 3",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AN01",
                restarunt_contact_number: "564545454",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test68",
                password: "test68",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = {
                    item_id: "V112",
                    item_description: "Mutton",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "180",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                }
                chai.request(server)
                    .post('/items/additem')
                    .send(item)
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.have.property('item_name');
                        done();
                    });

            });
        });



        it('it should POST a Items ', (done) => {

            let vendor = new VendorModel({
                restarunt_name: "Test 4",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV01",
                restarunt_contact_number: "5645645644",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test75",
                password: "test75",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = {
                    item_id: "Test2",
                    item_name: "chicken",
                    item_description: "test2",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "180",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                }
                chai.request(server)
                    .post('/items/additem')
                    .set('content-type', 'application/json')
                    .send(item)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('item_id');
                        res.body.should.have.property('item_description');
                        res.body.should.have.property('item_name');
                        res.body.should.have.property('item_price');
                        res.body.should.have.property('is_snack');
                        done();
                    });
            });
        });


    });

    /*
* Test the /GET/:vendor_id/:item_id route
*/
    describe('/GET/:vendor_id/:item_id user', () => {

        it('it should GET a Item by the given id', (done) => {

            let vendor = new VendorModel({
                restarunt_name: "Test 5",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV01",
                restarunt_contact_number: "5454546544",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test78",
                password: "test78",
                active_status: true
            });
            vendor.save((err, admin) => {

                let item = new ItemsModel({
                    item_id: "IT01",
                    item_name: "chicken",
                    item_description: "test1",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "150",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                });
                item.save((err, item) => {
                    chai.request(server)
                        .get('/items/' + item.belongs_To + '/' + item.item_id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('item_id');
                            res.body.should.have.property('item_description');
                            res.body.should.have.property('item_name');
                            res.body.should.have.property('item_price');
                            res.body.should.have.property('is_snack');
                            res.body.should.have.property('_id').eql(item.id);
                            done();
                        });
                });

            });
        });
    });

    /*
    * Test the /PUT/:vendor_id/:item_id route
    */
    describe('/PUT/:vendor_id/:item_id Item', () => {
        it('it should UPDATE a item given the id', (done) => {


            let vendor = new VendorModel({
                restarunt_name: "Test 6",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV01",
                restarunt_contact_number: "12312121256412",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "tgfggh",
                password: "tgfggh",
                active_status: true
            });
            vendor.save((err, admin) => {

                let item = new ItemsModel({
                    item_id: "IT02",
                    item_name: "chicken",
                    item_description: "test2",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "450",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                });


                item.save((err, item) => {
           
                    chai.request(server)
                        .put('/items/' + item.belongs_To + '/' + item.item_id)
                        .set('content-type', 'application/json')
                        .send({
                            item_id: "IT02",
                            item_name: "Mutton",
                            item_description: "test2",
                            item_image: '',
                            belongs_To: item.belongs_To,
                            item_price: "895",
                            is_snack: true,
                            item_available_at: "9:00",
                            active_status: true,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('item updated!');
                            res.body.result.should.have.property('item_price').eql(895);
                            done();
                        });
                });
            });
        });
    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id Item', () => {
        it('it should DELETE a Item given the id', (done) => {


            let vendor = new VendorModel({
                restarunt_name: "Test 7",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV01",
                restarunt_contact_number: "12121212",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "asdasdsa",
                password: "adsadsads",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = new ItemsModel({
                    item_id: "IT04",
                    item_name: "chicken",
                    item_description: "test2",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "450",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                });

                item.save((err, item) => {
                    
                    chai.request(server)
                        .delete('/items/deleteitem/' + item.belongs_To + '/' + item.item_id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message').eql('Item successfully deleted!');
                            res.body.result.should.have.property('item_id').eql("IT04");
                            done();

                        });
                });
            });
        });
    });

});

