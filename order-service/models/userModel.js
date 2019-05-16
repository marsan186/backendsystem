'use strict';

const mongoose = require('mongoose');
const bcrpt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const  config = require('config');
mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
    name: String,
    email_address: { type: String, required: true, unique: true },
	password: { type: String, required: true },
    contact_number: String,
    role: {
        type: String,
        default: 'user'
    },
    audit_user: String,
    active_status: { type: Boolean, default: true }
}, {
        timestamps: true
    });
	
	
UserSchema.methods.generateHash = function (password) {
    return bcrpt.hashSync(password, bcrpt.genSaltSync(8), null);
}
UserSchema.methods.validatePassword = function (password) {
    return bcrpt.compareSync(password, this.password);
}


UserSchema.pre('save', function (next) {
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

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrpt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
        email_address:this.email_address,
        id:this._id,
        exp:parseInt(expirationDate.getTime()/1000,10),
    },config.secret)
}

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);