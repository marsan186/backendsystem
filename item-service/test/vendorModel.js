'use strict';

const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
const VendorSchema = mongoose.Schema({
    restarunt_name: String,
    restarunt_address: String,
    restarunt_type: String,
    restarunt_id: String,
    restarunt_contact_number: String,
    restarunt_email: String,
    restarunt_description: String,
    restarunt_opening_time: String,
    restarunt_closing_time: String,
    restarunt_image: String,
    audit_user: String,
    active_status: { type: Boolean, default: false },
    user_name: { type: String, required: true, unique: true },
    password: String
}, {
        timestamps: true
    });

module.exports = mongoose.model('Vendor', VendorSchema);
