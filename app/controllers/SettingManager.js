var nconf = require('nconf');
exports.saveRechargeCode=function (req, res) {
    nconf.use('file', { file: './config.json' });
    nconf.load();
    console.log(req.body.code);
    nconf.set('rechargecode', req.body.code);

    nconf.save(function (err) {
        if (err) {
            if (err) res.send(err);
        }
        res.json({message: 'code created!'});

    });

}
exports.getRechargeCode=function (req, res) {
    nconf.use('file', { file: './config.json' });
    nconf.load();
    var result=nconf.get('rechargecode')
    var a={code:parseInt(result)};
    res.json(a);

}

