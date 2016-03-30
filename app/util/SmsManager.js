var Client = require('node-rest-client').Client;
var sms = require('../../config').sms;
var client = new Client();

exports.send = function (number, text) {
    var value = text.substr(0, 150);
    var args = {
        user: sms.user,
        password: sms.pass,
        mobile: number,
        senderid: number,
        message: value
    };
    client.registerMethod("sendSMS", "http://www.cubalan.com/sendsms.php", "GET");
    client.methods.sendSMS(args, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
        if (response == "1113:SUCCESS:SMS Scheduled Successfully")
            return true;
        else
            return false
    });

}