
var rest = require('restler');
var nconf = require('nconf');
var client = new Client();

exports.send = function (number, text) {
    var value = text.substr(0, 150);
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var sms = nconf.get('sms');
    var data = {
        user: sms.user,
        password: sms.pass,
        mobile: parseInt(number),
        senderid: "SMS",
        message: value
    };
    
    rest.post('http://old.cubalan.com/sendsms.php', {
        data: data,
    }).on('complete', function(data, response) {
        console.log("data",data);
       
    });

}