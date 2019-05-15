process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_ENV = 'test';
let mongoose = require("mongoose");
let OrderModel = require('../models/ordersModel');
let VendorModel = require('./vendorModel');
let UserModel = require('./userModel');
let ItemsModel = require('./itemsModel');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Orders', () => {
    beforeEach((done) => { //Before each test we empty the database
        OrderModel.deleteMany({}, (err) => {
            done();
        });
    });
	/*
	 * Test the /GET route
	 */
    describe('/GET:vendor_id Order', () => {
        it('it should GET all the Order by vendorid', (done) => {
            let vendor = new VendorModel({
                restarunt_name: "Test 1",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AF4121",
                restarunt_contact_number: "4544158128",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "test7132",
                password: "test7132",
                active_status: true
            });
            vendor.save((err, admin) => {
                chai.request(server)
                    .get('/orders/getorders/' + admin._id)
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
    describe('/POST Order', () => {
        it('it should not POST a Order without Amount field', (done) => {

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
                user_name: "test878",
                password: "test878",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = new ItemsModel({
                    item_id: "V112",
                    item_name: "Chicken",
                    item_description: "Mutton",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "180",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true
                });
                item.save((err, item) => {

                    let user = new UserModel({
                        name: "Tes1",
                        email_address: "dahhjhj@gmail.com",
                        password: "dahhjhj",
                        contact_number: '8959554551',
                        active_status: true
                    });

                    user.save((err, user) => {

                        let order = {
                            'delivery_address': 'Arni',
                            'item_id': item._id,
                            'item_count': 1,
                            'user': user._id,
                            'active_status': 'order_placed'
                        };
                        chai.request(server)
                            .post('/orders/addorder')
                            .send(order)
                            .end((err, res) => {

                                res.should.have.status(422);
                                res.body.should.be.a('object');
                                res.body.should.have.property('errors');
                                res.body.errors.should.have.property('amount');
                                done();
                            });
                    });
                });
            });

        });



        it('it should POST a Orders ', (done) => {

            let vendor = new VendorModel({
                restarunt_name: "Test 5",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AN089",
                restarunt_contact_number: "564545454",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "awfaf",
                password: "sddadsds",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = new ItemsModel({
                    item_id: "V112",
                    item_name: "Chicken",
                    item_description: "Mutton",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "180",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true
                });
                item.save((err, item) => {

                    let user = new UserModel({
                        name: "fffsdfdfd",
                        email_address: "fffsdfdfd@gmail.com",
                        password: "fffsdfdfd",
                        contact_number: '85858585858',
                        active_status: true
                    });

                    user.save((err, user) => {
                        let order = {
                            'delivery_address': 'Arni',
                            'amount': 180,
                            'item_id': item._id,
                            'item_count': 1,
                            'user': user._id,
                            'active_status': 'order_placed'
                        }
                        chai.request(server)
                            .post('/orders/addorder')
                            .send(order)
                            .end((err, res) => {

                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('delivery_address');
                                res.body.should.have.property('amount');
                                res.body.should.have.property('item_id');
                                res.body.should.have.property('item_count');
                                res.body.should.have.property('user');
                                done();
                            });
                    });
                });
            });
        });
    });

    /*
* Test the /GET/:vendor_id/:order_id route
*/
    describe('/GET/:vendor_id/:order_id Order', () => {

        it('it should GET a Order by the given id', (done) => {

            let vendor = new VendorModel({
                restarunt_name: "Test 7",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV07",
                restarunt_contact_number: "5454546544",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "sfff",
                password: "sfff",
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

                    let user = new UserModel({
                        name: "ewrerwre",
                        email_address: "ewrerwre@gmail.com",
                        password: "ewrerwre",
                        contact_number: '6868686868',
                        active_status: true
                    });

                    user.save((err, user) => {
                        let order = new OrderModel({
                            'delivery_address': 'Arni',
                            'amount': 180,
                            'item_id': item._id,
                            'item_count': 1,
                            'user': user._id,
                            'active_status': 'order_placed'
                        })

                        order.save((err, order) => {

                            chai.request(server)
                                .get('/orders/' + item.belongs_To + '/' + order._id)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('amount');
                                    res.body.should.have.property('delivery_address');
                                    res.body.should.have.property('item_id');
                                    res.body.should.have.property('item_count');
                                    res.body.should.have.property('user');
                                    res.body.should.have.property('_id').eql(order.id);
                                    done();
                                });
                        });
                    });
                });

            });
        });
    });

    /*
    * Test the /PUT/:order_id route
    */
    describe('/PUT/:order_id Order', () => {
        it('it should UPDATE a Order given the id', (done) => {


            let vendor = new VendorModel({
                restarunt_name: "Test 8",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV01",
                restarunt_contact_number: "544545444",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "ashhja",
                password: "ashhja",
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
                    active_status: true
                });


                item.save((err, item) => {

                    let user = new UserModel({
                        name: "fsdfd",
                        email_address: "fdsfs@gmail.com",
                        password: "sdffds",
                        contact_number: '6868686868',
                        active_status: true
                    });

                    user.save((err, user) => {

                        let order = new OrderModel({
                            'delivery_address': 'Arni',
                            'amount': 180,
                            'item_id': item._id,
                            'item_count': 1,
                            'user': user._id,
                            'active_status': 'order_placed'
                        })

                        order.save((err, order) => {


                            chai.request(server)
                                .put('/orders/' + order._id)
                                .set('content-type', 'application/json')
                                .send({
                                    'delivery_address': 'Arni',
                                    'amount': 200,
                                    'item_id': item._id,
                                    'item_count': 1,
                                    'user': user._id,
                                    'active_status': 'order_placed'
                                })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('message').eql('Order updated!');
                                    res.body.result.should.have.property('amount').eql(200);
                                    done();
                                });
                        });
                    });
                });
            });
        });
    });

    /*
    * Test the /DELETE/:vendor_id/:order_id route
    */
    describe('/DELETE/:vendor_id/:order_id Order', () => {
        it('it should DELETE a Order given the id', (done) => {


            let vendor = new VendorModel({
                restarunt_name: "Test 89",
                restarunt_address: "Arni",
                restarunt_type: "Hotel",
                restarunt_id: "AV089",
                restarunt_contact_number: "6898667871",
                restarunt_email: "fsefood2019@gmail.com",
                restarunt_description: "Good",
                restarunt_opening_time: "9:00 am",
                restarunt_closing_time: "10:00 pm",
                user_name: "asddw",
                password: "qweqewS",
                active_status: true
            });
            vendor.save((err, admin) => {
                let item = new ItemsModel({
                    item_id: "ITO58",
                    item_name: "Mutton",
                    item_description: "test2",
                    item_image: '',
                    belongs_To: admin._id,
                    item_price: "450",
                    is_snack: true,
                    item_available_at: "9:00",
                    active_status: true,
                });

                item.save((err, item) => {
                    let user = new UserModel({
                        name: "ewrrdasv",
                        email_address: "ewrrdasv@gmail.com",
                        password: "ewrrdasv",
                        contact_number: '7878654211',
                        active_status: true
                    });

                    user.save((err, user) => {

                        let order = new OrderModel({
                            'delivery_address': 'Arni',
                            'amount': 180,
                            'item_id': item._id,
                            'item_count': 1,
                            'user': user._id,
                            'active_status': 'order_placed'
                        })

                        order.save((err, order) => {

                            chai.request(server)
                                .delete('/orders/deleteorder/' + item.belongs_To + '/' + order._id)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('message').eql('Order successfully deleted!');
                                    res.body.result.should.have.property('_id').eql(order.id);
                                    done();

                                });
                        });
                    });
                });
            });
        });
    });

});