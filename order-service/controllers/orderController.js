'use strict';

var _ = require('lodash');
const Order = require('../models/ordersModel.js');

var validationError = function (res, err) {
    return res.json(422, err);
};
var handleError = function handleError(res, err) {
    return res.send(500, err);
}

// Creates a new order.
exports.createorders = function (req, res) {

    var neworder = new Order(req.body);
    neworder.save(function (err, order) {

        if (err) return validationError(res, err);
        res.status(200).json(order);
    });
}
// Get list of orders
exports.getAllorders = function (req, res) {
    console.log(req.params);
    if (req.params.vendor_id != null) {
        Order.find({})
            .populate('item_id',{ belongs_To: req.params.vendor_id })
            .exec(function (err, orders) {
                if (err) return validationError(res, err);
                console.log(orders);
                res.status(200).json(orders);
            })
    }
    else {
        res.json(400, 'no orders available');
    }
};

// Get list of orders -getSnacks
exports.getSnacksorders = function (req, res) {
    Order.find({ "isSnack": true, "belongs_To": req.params.vendor_id, "active_status": true }, function (err, orders) {
        if (err) { return handleError(res, err); }
        return res.json(200, orders);
    });
};

// Get list of orders - getDishes
exports.getDishesorders = function (req, res) {
    Order.find({ "isSnack": false, "belongs_To": req.params.vendor_id, "active_status": true }, function (err, orders) {
        if (err) { return handleError(res, err); }
        return res.json(200, orders);
    });
};


// Get a single order
exports.getorderById = function (req, res) {

    if (req.params.order_id != null) {
        Order.findOne({
            "_id": req.params.order_id
        })
            .populate('item_id', { belongs_To: req.params.vendor_id }).exec(function (err, orders) {
                if (err) return validationError(err);
                res.status(200).json(orders);
            })
    }
    else {
        res.json(400, 'no orders available');
    }
};




// Updates an existing order.
exports.updateorderById = function (req, res) {
    Order.findOne({
        "_id": req.params.order_id
    }, function (err, order) {
        if (err) { return validationError(res, err); }
        if (!order) { return res.send(404); }
        var updated = _.merge(order, req.body);
        updated.save(function (err, result) {
            if (err) { return validationError(res, err); }
            return res.json(200, { message: "Order updated!", result });
        });
    });

};

// Deletes an order.
exports.deleteorderById = function (req, res) {
    if (req.params.vendor_id != null) {
        Order.findOne({
            "_id": req.params.order_id
        }).populate('item_id', { belongs_To: req.params.vendor_id }).exec(function (err, order) {


            if (err) { return handleError(res, err); }
            if (!order) { return res.send(404); }
            order.active_status = false;
            order.save(function (err, result) {
                if (err) { return handleError(res, err); }
                return res.json(200, { message: "Order successfully deleted!", result });
            })
        });
    }
    else {
        res.json(400, 'no orders available');
    }
};

exports.deleteordersById = function (req, res) {
    if (req.params.vendor_id != null) {
        Order.findOne({
            "belongs_To": req.params.vendor_id,
            "order_id": req.params.order_id
        }, function (err, order) {
            if (err) { return handleError(res, err); }
            if (!order) { return res.send(404); }
            order.active_status = false;
            order.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json('deleted successfully');
            });
        });
    }
    else {
        res.json(400, 'no orders available');
    }
};


