'use strict';

const mongoose = require('mongoose');
const bcrpt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const  config = require('config');
mongoose.set('useCreateIndex', true);

const AdminUser = new mongoose.Schema({
    
    name: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    contact_number: Number,
    role: {
        type: String,
        default: 'Admin'
    },
    audit_user: String,
    active_status: Boolean,
    create_at: {
        type: String, default: Date.now()
    }
});

AdminUser.methods.generateHash = function (password) {
    return bcrpt.hashSync(password, bcrpt.genSaltSync(8), null);
}
AdminUser.methods.validatePassword = function (password) {
    return bcrpt.compareSync(password, this.password);
}

AdminUser.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrpt.genSalt(8, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrpt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});




AdminUser.methods.comparePassword = function (passw, cb) {
      bcrpt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


AdminUser.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
        username:this.username,
        id:this._id,
        exp:parseInt(expirationDate.getTime()/1000,10),
    },config.secret)
}

AdminUser.plugin(uniqueValidator);

 module.exports = mongoose.model('Admin', AdminUser);