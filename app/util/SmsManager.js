var Client = require('node-rest-client').Client;
var nconf = require('nconf');
var client = new Client();

exports.send = function (number, text) {
    var value = text.substr(0, 150);
    nconf.use('file', { file: './config.json' });
    nconf.load();
    var sms=nconf.get('sms');
    var data = {
        user: sms.user,
        password: sms.pass,
        mobile: parseInt(number),
        senderid: "SMS Listener",
        message: value
    };
    var args = {
        path: data,
        headers: { "Content-Type": "application/json" }
    };

    client.registerMethod("sendSMS", "http://old.cubalan.com/sendsms.php?user=${user}&password=${password}&mobile=${mobile}&senderid=${senderid}&group_id=1,2&message=${message}&schedulez=yyyy:mm:dd:hh:mm:ss", "GET");
    client.methods.sendSMS(args, function (data, response) {
        // parsed response body as js object

        // raw response
        console.log(response);
        if (response == "1113:SUCCESS:SMS Scheduled Successfully")
            return true;
        else
            return false
    });

}