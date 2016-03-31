var nconf = require('nconf');
var nodemailer = require('nodemailer');
exports.sendMail = function (to, subjet, text) {
    nconf.use('file', { file: './config.json' });
    nconf.load();
    var smtpConfig=nconf.get('smtpConfig');
    var transporter = nodemailer.createTransport(smtpConfig);
    var mailOptions = {
        from: smtpConfig.auth.user,
        to: to,
        subject: subjet,
        text: text,
    
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });
    

}
