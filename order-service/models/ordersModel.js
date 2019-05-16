'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('./itemsModel');
require('./userModel');



var OrderSchema = new Schema({
    placed_date: {
        type: Date,
        default: Date.now
    },
    delivered_date: {
        type: Date,
        default: Date.now
    },
    delivery_address: String,
    amount: { type: Number, required: true },
    item_id: { type: Schema.ObjectId, ref: 'Items' },
    item_count: {
        type: Number,
        default: 1
    },
    user: { type: Schema.ObjectId, ref: 'User' },
    active_status: { type: String, default: 'order_placed' }
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Order', OrderSchema);
