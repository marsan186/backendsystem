'use strict';
var _ = require('lodash');
const User = require('../models/userModel.js');

var validationError = function (res, err) {
    return res.json(422, err);
};


// Creates a new user


exports.createUser = function (req, res, next) {
    var newAdmin = new User(req.body);
    newAdmin.email_address = req.body.userName;
    newAdmin.provider = 'local';
    newAdmin.role = 'user';
    newAdmin.save(function (err, rec) {
        if (err) return validationError(res, err);
        res.status(200).json(rec);
    });
};




//user Login

exports.userLogin = function (req, res, next) {

    User.findOne({ email_address: req.body.userName }).then(loginUser => {
        if (!loginUser) {
            return res.status(401).json("Invalid user name and password");
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


//Get list of users

exports.getUsersDetails = function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.send(500, err);
        res.status(200).json(users);
    });
};

// get user by Id

exports.findUserByUserId = function (req, res, next) {
    var userId = req.params.UserId;
    User.findOne({
        "_id": userId
    }, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.status(200).json(user);
    });
};

// delete user by Id

exports.deleteUserDetailsByUserId = function (req, res) {
    User.findByIdAndDelete(req.params.UserId, function (err, result) {
        if (err) return res.send(500, err);
        return res.json(200, { message: "User successfully deleted!", result });
    });
};


//update user by Id

exports.updateUserByUserId = function (req, res) {
    var UserId = req.params.UserId;
   
    User.findOne({
        "_id": UserId
    }, function (err, user) {
     
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        var updated = _.merge(user, req.body);
        var newAdmin = new User(updated);
        if (req.body.password !== "" && req.body.email_address !== "") {
            newAdmin.email_address = req.body.email_address;
            newAdmin.password = req.body.password;
        }
      
        newAdmin.save(function (err, result) {
            if (err) { return handleError(res, err); }
            return res.json(200, { message: "User updated!", result });
        });
    });
};
