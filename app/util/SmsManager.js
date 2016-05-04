
var rest = require('restler');
var nconf = require('nconf');

//consume un servicio pa enviar sms
exports.send = function (number, text, phone) {

    var value = text.substring(0, 150);
    var enviado="\n"+"Enviado desde "+phone;
    var enviar=value.concat(enviado);
    console.log("texto a enviar",value);
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var sms = nconf.get('sms');
    var data = {
        user: sms.user,
        password: sms.pass,
        mobile: parseInt(number),
        senderid:  parseInt(number),
        message: enviar
    };
    
    rest.post('http://old.cubalan.com/sendsms.php', {
        data: data,
    }).on('complete', function(data, response) {
        console.log("data",data);
       
    });

}