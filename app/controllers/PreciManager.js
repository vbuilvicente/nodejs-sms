var mongoose = require('mongoose');
var Preci = mongoose.model('Preci');
exports.createPreci = function (req, res) {

    var preci = new Preci();
    preci.country = req.body.country;
    preci.preci = req.body.preci;
    preci.code = req.body.code;


    preci.save(function (err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({success: false, message: 'A Preci with that code already exists. '});
            else
                return res.send(err);
        }

        // return a message
        res.json({message: 'Preci created!'});
    });
}
exports.getPrecis= function (req, res) {
    Preci.find({}, function (err, preci) {
        if (err) res.send(err);

        // return the users
        res.json(preci);
    })
}
exports.getPreciByCode= function (code,next) {
    Preci.find({})
        .where('code')
        .equals(code)
        .exec(function (err, preci) {
           next(preci.preci);
        })
}

exports.getPreci = function (req, res) {
    Preci.findById(req.params.preci_id, function (err, preci) {
        if (err) res.send(err);

        // return that user
        res.json(preci);
    });
}
exports.updatePreci = function (req, res) {

    Preci.findById(req.params.preci_id, function (err, preci) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.country) preci.country = req.body.country;
        if (req.body.type) preci.preci = req.body.preci;
        if (req.body.email) preci.code = req.body.code;

        // save the user
        preci.save(function (err) {
            if (err) res.send(err);

            // return a message
            res.json({message: 'Preci updated!'});
        });

    });
}
exports.deletePreci = function (req, res) {

    Preci.remove({
        _id: req.params.preci_id
    }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
    });


}