/**
 * Created by victor on 17/03/16.
 */
var mongoose = require('mongoose');
var Queue = mongoose.model('Queue');

exports.createQueue = function (req, res) {

    var queue = new Queue();
    queue.name = req.body.name;
    queue.username = req.body.username;
    queue.password = req.body.password;
    queue.host = req.body.host;
    queue.port = req.body.port;
    queue.tls = (req.body.tls)?true:false;
    queue.type = req.body.type;
    queue.email = req.body.email;
    queue.created=new Date();

    queue.save(function (err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({success: false, message: 'A queue with that email already exists. '});
            else
                return res.send(err);
        }

        // return a message
        res.json({message: 'Queue created!'});
    });
}
exports.getQueues = function (req, res) {
    Queue.find({}, function (err, queue) {
        if (err) res.send(err);

        // return the users
        res.json(queue);
    });
}
exports.getQueuesListener = function (next) {
    Queue.find({})
        .exec(function(error, queue) {
          next(queue);

        });
}
exports.getQueue = function (req, res) {
    Queue.findById(req.params.queue_id, function (err, queue) {
        if (err) res.send(err);

        // return that user
        res.json(queue);
    });
}
exports.updateQueue = function (req, res) {

    Queue.findById(req.params.queue_id, function (err, queue) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) queue.name = req.body.name;
        if (req.body.username) queue.username = req.body.username;
        if (req.body.password) queue.password = req.body.password;
        if (req.body.host) queue.host = req.body.host;
        if (req.body.port) queue.port = req.body.port;
        if (req.body.tls) queue.tls = (req.body.tls)?true:false;
        if (req.body.type) queue.type = req.body.type;
        if (req.body.email) queue.email = req.body.email;

        // save the user
        queue.save(function (err) {
            if (err){
                 res.json({message:err.code});
            }
            else{
                res.json({message: 'Queue updated!'});
            }

        });

    });
}
exports.deleteQueue = function (req, res) {

    Queue.remove({
        _id: req.params.queue_id
    }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
    });


}