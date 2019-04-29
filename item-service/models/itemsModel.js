'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemsSchema = new Schema({
    item_id: { type: String, required: true },
    item_name: { type: String, required: true },
    item_description: { type: String },
    item_image: String,
    belongs_To: { type: Schema.ObjectId, ref: 'Vendor' },
    item_price: { type: Number, required: true },
    is_snack: { type: Boolean, default: false },
    item_available_at: String,
    active_status: { type: Boolean, default: true }
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Items', ItemsSchema);
