var express = require('express');
var router = express.Router();
const orders = require('../controllers/orderController.js');
// Creates a new order.

router.route('/addorder').post(orders.createorders);
// Get list of orders
router.route('/getorders/:vendor_id').get(orders.getAllorders);
// Get a single order
router.route('/:vendor_id/:order_id').get(orders.getorderById);
// Updates an existing order.
router.route('/:order_id').put(orders.updateorderById);
//soft Deletes an order.
router.route('/deleteorder/:vendor_id/:order_id').delete(orders.deleteorderById);
//soft Deletes an order.
router.route('/:order_id').delete(orders.deleteordersById);
// Get list of orders -getSnacks
router.route('/snacks').get(orders.getSnacksorders);
// Get list of orders - getDishes
router.route('/dishes').get(orders.getDishesorders);

module.exports = router;