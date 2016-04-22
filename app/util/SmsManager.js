
var rest = require('restler');
var nconf = require('nconf');


exports.send = function (number, text) {
    console.log("texto a enviar",text);
    var value = text.substring(0, 150);
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