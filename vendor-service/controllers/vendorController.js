'use strict';
const jwt = require('jsonwebtoken');
var _ = require('lodash');
const Vendor = require('../models/vendorModel.js');
const mailcontroller = require('./mailController');
const imagecopitercontroller = require('./imageCopierController');
const otpGenerator = require('otp-generator');

var validationError = function (res, err) {
    return res.json(422, err);
};

var handleError = function handleError(res, err) {
    return res.send(500, err);
}
// Creates a new vendor

exports.createVendor = function (req, res, next) {
    //console.log('vendor-ctrl');
    // console.log(req.body);
    var newVendor = new Vendor(req.body);
    Vendor.findOne({
        "user_name": newVendor.user_name
    }, function (err, vendor) {
        if (err) return next(err);
        if (vendor) return res.send(401, { msg: "vendor already exist!!!" });
        else {
            newVendor.role = 'vendor';
            mailcontroller.sendMailtoUser(req.body.restarunt_email);
            if (res) {
                newVendor.save(function (err, vendor) {
                    if (err) return validationError(res, err);
                    res.status(200).json(vendor);
                    // console.log(vendor);
                });
                // smscontroller.sendSmstoUser();
            }
            else {
                console.log(res);
            }
        }
    });
};

//vendor login
exports.loginVendor = function (req, res, next) {
    var username = req.body.data.user_name;
    var password = req.body.data.password;

    Vendor.findOne({
        "user_name": username,
        "password": password,
        "active_status": true
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
        else {
            var token = jwt.sign({ user_name: vendor.user_name }, 'vendor-shared-secret', { expiresIn: '1h' });
            /*  var response = {user_name: username};
             response.token=token;*/
            var vendorresponse = { user_name: vendor.user_name, vendor_id: vendor._id };
            res.send(200, { vendorresponse, token: token });
            //  res.json(vendor);
        }
    });
};

//Get list of vendors

exports.getVendorsDetails = function (req, res) {
    Vendor.find({
        // "active_status": true
    }, function (err, vendors) {
        if (err) return res.send(500, err);
        res.json(200, vendors);
    });
};

// get vendor by Id
/* 
exports.findVendorByVendorId = function (req, res, next) {
    var RestaruntId = req.params.RestaruntId;
    Vendor.findOne({
        "RestaruntId": RestaruntId
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
        res.json(vendor);
    });
}; */
// get vendor by user name
exports.findVendorByVendorUsername = function (req, res, next) {
    var user_name = req.params.user_name;
    // console.log(user_name);
    Vendor.findOne({
        "user_name": user_name,
        "active_status": true
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
        // console.log(vendor);
        res.status(200).json(vendor);
    });
};

// delete vendor

exports.deletevendorDetailsByvendorId = function (req, res) {
    Vendor.findByIdAndDelete(req.params.vendor_id, function (err, result) {
        if (err) { return handleError(res, err); }
        return res.json(200, { message: "Vendor successfully deleted!", result });
    });
};

//update vendor details

/* exports.updateVendorByVendorId = function (req, res) {
    var RestaruntId = req.params.RestaruntId;
    Vendor.findOne({
        "RestaruntId": RestaruntId
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        var updated = _.merge(vendor, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, vendor);
        });
    });
};
 */


exports.updateVendorByVendorUsername = function (req, res) {
    var user_name = req.params.user_name;
    Vendor.findOne({
        "user_name": user_name,
        "active_status": true
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        var updated = _.merge(vendor, req.body);
        updated.save(function (err, rec) {
            if (err) { return handleError(res, err); }
            return res.status(200).json({ success: true, result: rec, msg: "updated successfully" });
        });
    });
};

exports.activateVendor = function (req, res) {
    var user_name = req.params.user_name;
    Vendor.findOne({
        "user_name": user_name
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        vendor.active_status = true;
        vendor.save(function (err, rec) {
            if (err) { return handleError(res, err); }
            return res.status(200).json({ success: true, result: rec, msg: "Activated successfully" });
        });
    });
};

exports.forgotpassword = function (req, res) {
    var restarunt_email = req.body.restarunt_email;
    Vendor.findOne({
        "restarunt_email": restarunt_email,
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) {
            if (!vendor) { return res.send(404); }
        }
        else {
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            var mailtext = { "restarunt_email": restarunt_email, "otp": otp };
            mailcontroller.sendOtpToUser(mailtext);
            res.send(200, { otp: otp, user_name: vendor.user_name });
        }

    });
};


