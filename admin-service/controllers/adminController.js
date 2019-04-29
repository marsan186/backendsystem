'use strict';
var _ = require('lodash');
const Admin = require('../models/adminModel.js');

var validationError = function (res, err) {
    return res.json(422, err);
};

// Creates a new Admin

exports.createAdmin = function (req, res, next) {
    var newAdmin = new Admin(req.body);
    newAdmin.username = req.body.user_name;
    newAdmin.provider = 'local';
    newAdmin.role = 'admin';
    newAdmin.save(function (err, rec) {
        if (err) return validationError(res, err);
        res.status(200).json(rec);
    });
};

// Admin Login


exports.adminLogin = function (req, res, next) {

    Admin.findOne({ username: req.body.user_name }).then(loginUser => {
        if (!loginUser) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            loginUser.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // const withTokem ={...loginUser}
                    const withTokem = { username: loginUser.username, _id: loginUser._id }
                    withTokem.token = loginUser.generateJWT();
                    res.status(200).json(withTokem);
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    })

};

//Get list of Admin

exports.getAdminDetails = function (req, res) {
    Admin.find({}, function (err, rec) {
    
        if (err) return res.send(500, err);
        res.status(200).json(rec);
    });
};

// get Admin by Id

exports.findAdminByAdminId = function (req, res, next) {
    var adminId = req.params.admin_id;
    Admin.findOne({
        "_id": adminId
    }, function (err, rec) {
        if (err) return next(err);
        if (!rec) return res.send(401);
        res.json(rec);
    });
};


//update Admin details

exports.updateAdminByAdminId = function (req, res) {
    var admin_id = req.params.admin_id;

    Admin.findById({
        "_id": admin_id
    }, function (err, user) {
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        var updated = _.merge(user, req.body);
        var newAdmin = new Admin(updated);
        if (req.body.password !== "" && req.body.user_name !== "") {
            newAdmin.username = req.body.user_name;
            newAdmin.password = req.body.password;
        }

        newAdmin.save(function (err, result) {

            if (err) { return handleError(res, err); }
            return res.json(200, { message: "Admin updated!", result });
        });
    });
};

// delete Admin

exports.deleteAdminDetailsByAdminId = function (req, res) {
    Admin.findById(req.params.admin_id, function (err, rec) {
        if (err) { return handleError(res, err); }
        if (!rec) { return res.send(404); }
        Admin.remove(function (err, result) {
            if (err) { return handleError(res, err); }
            return res.json(200, { message: "Admin successfully deleted!", result });
        });
    });
};
