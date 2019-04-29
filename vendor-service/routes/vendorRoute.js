var express = require('express');
var router = express.Router();
const vendor = require('../controllers/vendorController');
const authenticate = require("../middleware/authenticate");

// Create a new Vendor
router.route('/').post(vendor.createVendor);

//Vendor Login
router.route('/login').post(vendor.loginVendor);

// Retrieve all Vendor
router.route('/').get(vendor.getVendorsDetails);

// Retrieve a single Vendor with vendorId
/* router.route('/:RestaruntId').get(vendor.findVendorByVendorId);
 */
router.route('/:user_name').get(vendor.findVendorByVendorUsername);

// Update a vendor with vendorId
router.route('/:user_name').put(vendor.updateVendorByVendorUsername);

//activate vendor
router.route('/activate/:user_name').put(vendor.activateVendor);

// Delete a Vendor with vendorId
router.delete('/:vendor_id', vendor.deletevendorDetailsByvendorId);

//forgot password
router.route('/forgotpassword').post(vendor.forgotpassword);


module.exports = router;
