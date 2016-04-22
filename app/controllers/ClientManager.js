/**
 * Created by victor on 17/03/16.
 */
var mongoose = require('mongoose');
var Client = mongoose.model('Client');

exports.createClient = function (req, res) {

    var client = new Client();
    client.name = req.body.name;
    client.phone = req.body.phone;
    client.credit = req.body.credit;
    client.email = req.body.email;
    client.valid = true;
    client.created = new Date();

    client.save(function (err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({success: false, message: 'A Client with that Clientname already exists. '});
            else
                return res.send(err);
        }

        //  return a message
        res.json({message: 'Client created!'});
    });
}
exports.createClientForRequest = function (email, next) {

    var client = new Client();
    client.email = email[0].address;
    client.name = email[0].name;
    client.valid = false;
    client.countFree = 2;
    client.created = new Date();

    client.save(function (err, result) {
        if (!err)
            return next(result);


    });
}
exports.getClients = function (req, res) {
    Client.find({}, function (err, client) {
        if (err) res.send(err);

        // return the Clients
        res.json(client);
    });
}
//no api aun
exports.getClientInvalid = function (req, res) {
    Client.find({valid: false}, function (err, client) {
        if (err) res.send(err);

        // return the Clients
        res.json(client);
    });
}
//no api aun
exports.geClientInvalidLast = function (req, res) {
    Client.find({valid: false}).sort({created: -1})
        .limit(10)
        .exec(function (err, client) {
            if (err) res.send(err);
            // return the RequestSmS
            res.json(client);
        });
}

exports.getClient = function (req, res) {

    Client.findById(req.params.client_id, function (err, client) {
        if (err) res.send(err);

        res.json(client);
    });


}
exports.getClientByEmail = function (email, next) {
    Client.findOne({email: email}).exec(function (err, client) {
        if (!err)
            next(client);
    })
}

exports.updateClient = function (req, res) {

    Client.findById(req.params.client_id, function (err, client) {

        if (err) res.send(err);

        // set the new Client information if it exists in the request
        if (req.body.name) client.name = req.body.name;
        if (req.body.phone) client.phone = req.body.phone;
        if (req.body.email) client.email = req.body.email;
        if (req.body.credit) client.credit = req.body.credit;

        // save the Client
        client.save(function (err) {
            if (err) res.send(err);

            // return a message
            res.json({message: 'Client updated!'});
        });

    });
}
exports.updateClientInvalid = function (clientupdate) {

    Client.findById(clientupdate.id, function (err, client) {

        if (!err) {

            client.countFree = client.countFree - 1;

            // save the Client
            client.save(function (err) {

            });
        }


    });
}
exports.updateClientCredit = function (clientupdate, newcredit) {

    Client.findById(clientupdate.id, function (err, client) {

        if (err) return false;

        client.credit = parseFloat(client.credit ) - parseFloat(newcredit);
          console.log("credito nuevo",client.credit);
        // save the Client
        client.save(function (err) {
            if (err)
                return false;

            return true;
        });

    });
}
exports.rechargeClientCredit = function (clientupdate, newcredit) {

    Client.findById(clientupdate.id, function (err, client) {

        if (err) return false;

        if (newcredit) client.credit =  newcredit;

        // save the Client
        client.save(function (err) {
            if (err)
                return false;

            return true;
        });

    });
}


exports.deleteClient = function (req, res) {

    Client.remove({
        _id: req.params.client_id
    }, function (err, client) {
        if (err) res.send(err);

        res.json({message: 'Successfully deleted'});
    });


}