/**
 * Created by victor on 17/03/16.
 */
var mongoose = require('mongoose');
var RequestSmS = mongoose.model('RequestSmS');


exports.createRequest = function (type, client, credit) {
    var request = new RequestSmS();
    request.type = type;
    request.created = new Date();
    request.client = client;
    request.credit = credit;
    request.save();
}
//no api aun
exports.getRequests = function (req, res) {
    RequestSmS.find({}, function (err, requests) {
        if (err) res.send(err);

        // return the RequestSmS
        res.json(requests);
    });
}
exports.getRequestsByClient= function (req, res) {
    RequestSmS.find().populate({
        path: 'Client',
        match: {client: req.params.client_id},
    }).exec(function (err, requests) {
        if (err) res.send(err);

        // return the RequestSmS
        res.json(requests);
    });

}
exports.getRequestsRange = function (first, last, next) {
    var mongoose = require('mongoose');
    var RequestSmS = mongoose.model('RequestSmS');
    
    RequestSmS.aggregate(
        [
            {$match: {created: {$gte: first, $lt: last}}},
            {
                $group: {
                    _id: null,
                    credit: {$sum: "$credit"},
                    count: {$sum: 1}
                }
            }
        ]
    ).exec(function (err, client) {
        if (!err)
            next(client);
    })
}
//no api aun
exports.getRequestLast = function (req, res) {
    RequestSmS.find({}).sort({created: -1})
        .limit(10)
        .exec(function (err, requests) {
            if (err) res.send(err);
            // return the RequestSmS
            res.json(requests);
        });
}
//no api aun
exports.getRequestsRecharge = function (req, res) {
    RequestSmS.find({type: "Recharge"}, function (err, requests) {
        if (err) res.send(err);

        // return the RequestSmS
        res.json(requests);
    });
}
//no api aun
exports.getRequestRechargeLast = function (req, res) {
    RequestSmS.find({type: "Recharge"}).sort({created: -1})
        .limit(10)
        .exec(function (err, requests) {
            if (err) res.send(err);
            // return the RequestSmS
            res.json(requests);
        });
}