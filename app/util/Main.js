var nconf = require('nconf');
var htmlToText = require('html-to-text');
var MailListener = require('./MailListener');
var MailManager = require('./MailManager');
var SmsManager = require('./SmsManager');
var RequestManager = require('../controllers/RequestManager');
var ClientManager = require('../controllers/ClientManager');
var PreciManager = require('../controllers/PreciManager');
var QueueManger = require('../controllers/QueueManager');
var listeners = [];
function init() {


    QueueManger.getQueuesListener(function (queue) {
        for (i in queue) {

            var mailListener = new MailListener({
                username: queue[i].username,
                password: queue[i].password,
                host: queue[i].host,
                port: queue[i].port,
                tls: queue[i].tls,
                tlsOptions: {rejectUnauthorized: false},
                mailbox: "INBOX",
                //  searchFilter: ["UNSEEN", "FLAGGED"],
                markSeen: true,
                fetchUnreadOnStart: true,
                attachments: false,
                attachmentOptions: {directory: "attachments/"}
            });

            mailListener.start();

            mailListener.on("server:connected", function () {
                console.log("imapConnected");
            });

            mailListener.on("server:disconnected", function () {
                console.log("imapDisconnected");
            });

            mailListener.on("error", function (err) {
                console.log(err);
            });

            mailListener.on("mail", function (mail) {
                onMail(mail);
            });
            listeners.push(mailListener);
        }
    });


};

exports.Start = function () {
    this.Stop();
    init();
    console.log('running');
};
exports.Stop = function () {
    if (listeners.length > 0) {
        for (i in listeners) {
            listeners[i].stop();
        }
    }
    console.log('stop');
};
function onMail(mail) {

    //find client
    ClientManager.getClientByEmail(mail.from[0].address, function (client) {

            var type = getTypeRequest(mail);
            console.log("asunto", mail);
            console.log("testo indefinido ", (mail.text == undefined));
            var texto = ""
            if (mail.text == undefined) {
                var text = htmlToText.fromString(mail.html, {
                    wordwrap: 130
                });
                texto = text;
            }
            else {
                texto = mail.text;
            }


            if (client === null) {

                if (type == "Request") {

                    var code = getCountryCode(mail.subject);
                    PreciManager.getPreciByCode(code, function (credit) {
                        ClientManager.createClientForRequest(mail.from, function (newClient) {
                            if (newClient != null) {
                                RequestManager.createRequest('Request', newClient, credit);
                                console.log("Request Created");
                                var number = mail.subject.replace(' ', '');
                                SmsManager.send(number, texto);

                            }
                        });

                    });
                }

            }
            else {

                if (!client.valid && client.countFree > 0) {
                    ClientManager.updateClientInvalid(client);

                    if (type == "Request") {
                        var code = getCountryCode(mail.subject);
                        PreciManager.getPreciByCode(code, function (credit) {
                            RequestManager.createRequest('Request', client, credit);
                            var number = mail.subject.replace(' ', '');
                            SmsManager.send(number, texto);
                        });

                    }
                } else if (!client.valid && client.countFree == 0) {
                    var text = "Su periodo de prueba ha expirado pongase en contacto con el proveedor qf.clientes@gmail.com";
                    MailManager.sendMail(mail.from[0].address, "Cuenta ha expirado", text);
                }
                else {
                    if (client.valid) {

                        var text = "";
                        switch (type) {
                            case 'Request':
                                var code = getCountryCode(mail.subject);
                                PreciManager.getPreciByCode(code, function (credit) {

                                    if (parseFloat(client.credit) >= parseFloat(credit)) {

                                        ClientManager.updateClientCredit(client, credit);
                                        RequestManager.createRequest('Request', client, credit);
                                        var number = mail.subject.replace(' ', '');
                                        SmsManager.send(number, texto);
                                    }
                                    else {
                                        text = "Usted tiene " + client.credit + "cuc, Saldo insuficiente.";
                                        MailManager.sendMail(mail.from[0].address, "Saldo insuficiente", text);
                                    }
                                });


                                break;
                            case 'CreditRequest':
                                text = "Usted tiene " + client.credit + "cuc y nunca expira";
                                MailManager.sendMail(mail.from[0].address, "Saldo", text);
                                break;
                            case 'Recharge':
                                console.log("Tipo", type);
                                onRecharge(mail);
                                break;
                            default:
                                break;
                        }

                    }
                }
            }

        }
    );


};

function onRecharge(mail) {

    if (mail.to[0].address == "osagale@nauta.cu" || mail.to[0].address == "osagale@gmail.com") {
        if (validRecharge(mail.text) && validatedCode(mail.text)) {

            var email = getTargetMail(mail.text);
            var count = getTargetCount(mail.text);

            ClientManager.getClientByEmail(email, function (client) {

                var value = parseFloat(client.credit) + parseFloat(count);

                ClientManager.rechargeClientCredit(client, value);
                var text = "Usted ha recibido " + count + " cuc y nunca expira";
                SmsManager.send(client.phone, text);
            });

        }
        else {
            console.log("no");
        }


    }

};

function getTypeRequest(mail) {
    var exp = /^([0-9])+\s([0-9])+$/;
    if (exp.test(mail.subject)) {
        return 'Request'
    }
    else if (mail.subject == 'saldo') {
        return 'CreditRequest';
    }
    else if (mail.subject == 'Re') {
        return 'Recharge';
    }
    else {
        text = "Petición Incorrecta." +"\n"+
            "Consultar saldo, escriba en el asunto:saldo" +
            "Enviar un SMS, escriba en el asunto : códigopaís espacio número telefónico " +
            "en el texto del correo el mensaje a enviar, solo 150 caracteres. " +
            "Ejemplo  de  petición: " +"\n"+
            "asunto:53 54123456 " +
            "texto:hola " +"\n"+
            "Gracias por usar el servicio.";
        MailManager.sendMail(mail.from[0].address, "Error", text);
        return 'lol';

    }

};

function getTargetMail(text) {
    var mail = text.substring(0, text.indexOf(' '));
    return mail;
};
function validatedCode(text) {
    var nconf = require('nconf');
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var result = nconf.get('rechargecode');

    var number = text.substring(text.indexOf(' ') + 1, result.length);
    var code = parseInt(number.substring(0, result.length));

    if (code == number) {
        return true;
    } else {
        return false;
    }
};
function getTargetCount(text) {
    var nconf = require('nconf');
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var result = String(nconf.get('rechargecode'));
    var number = text.substring(text.indexOf(' ') + 1, text.length);
    var count = number.substring(result.length, number.length);
    var code = number.substring(0, result.length);

    return parseInt(count);
};

function validRecharge(text) {

    var exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+\s([0-9])+\n$/;
    return exp.test(text);
};

function getCountryCode(subject) {
    return subject.substring(0, 2);
};
