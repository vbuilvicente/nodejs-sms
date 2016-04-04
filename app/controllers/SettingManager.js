var nconf = require('nconf');
exports.saveRechargeCode = function (req, res) {
    nconf.use('file', {file: './config.json'});
    nconf.load();
    console.log(req.body.code);
    nconf.set('rechargecode', req.body.code);
    nconf.set('smtpConfig', req.body.smtp);
    nconf.set('sms', req.body.sms);

    nconf.save(function (err) {
        if (err) {
            if (err) res.send(err);
        }
        res.json({message: 'code created!'});

    });
   

}
exports.getRechargeCode = function (req, res) {
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var code = nconf.get('rechargecode');
    var smtpConfig = nconf.get('smtpConfig');
    var sms = nconf.get('sms');
    var a = {code: parseInt(code), smtp: smtpConfig, sms: sms};

    res.json(a);

}

