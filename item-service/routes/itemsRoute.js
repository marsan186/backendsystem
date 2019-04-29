var express = require('express');
var router = express.Router();
const items = require('../controllers/itemsController.js');
// Creates a new Item.

router.route('/additem').post(items.createItems);
// Get list of Items
router.route('/getitems/:vendor_id').get(items.getAllItems);
// Get a single Item
router.route('/:vendor_id/:item_id').get(items.getItemById);
// Updates an existing Item.
router.route('/:vendor_id/:item_id').put(items.updateItemById);
//soft Deletes an Item.
router.route('/deleteitem/:vendor_id/:item_id').put(items.deleteItemById);
//soft Deletes an Item.
router.route('/deleteitem/:vendor_id/:item_id').delete(items.deleteItemsById);
// Get list of Items -getSnacks
router.route('/snacks').get(items.getSnacksItems);
// Get list of Items - getDishes
router.route('/dishes').get(items.getDishesItems);
//Get lsit of cart item - getCartItem
router.route('/cart').get(items.getCartItem);
module.exports = router;