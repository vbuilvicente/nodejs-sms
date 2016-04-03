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


}

exports.Start = function () {
    this.Stop();
    init();
    console.log('running');
}
exports.Stop = function () {
    if (listeners.length > 0) {
        for (i in listeners) {
            listeners[i].stop();
        }
    }
    console.log('stop');
}
function onMail(mail) {

    //find client
    ClientManager.getClientByEmail(mail.from[0].address, function (client) {
            var type = getTypeRequest(mail);

            if (client == null) {
                if (type == "Request") {
                    console.log(mail.from);
                    var code = getCountryCode(mail.subject);
                    PreciManager.getPreciByCode(code, function (credit) {
                        ClientManager.createClientForRequest(mail.from, function (newClient) {
                            if (newClient != null) {
                                RequestManager.createRequest('Request', newClient, credit);
                                var number = mail.subject.substring(mail.subject.indexOf(' '), mail.subject.length);
                                SmsManager.send(number, mail.text);

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
                            var number = mail.subject.substring(mail.subject.indexOf(' '), mail.subject.length);
                            SmsManager.send(number, mail.text);
                        });

                    }
                } else if (!client.valid && client.countFree == 0) {
                    var text = "Su periodo de prueba ha expirado pongase en contacto con el proveedor";
                    MailManager.sendMail(mail.from[0].address, "Cuenta ha expirado", text);
                }
                else {
                    if (client.valid) {
                        var text = "";
                        switch (type) {
                            case 'Request':
                                var code = getCountryCode(mail.subject);
                                PreciManager.getPreciByCode(code, function (credit) {
                                    if (client.credit >= credit) {
                                        ClientManager.updateClientCredit(client, credit);
                                        RequestManager.createRequest('Request', client, credit);
                                        SmsManager.send(client.phone, mail.text);
                                    }
                                    else {
                                        text = "Usted tiene" + client.credit + "cuc, Saldo insuficiente.";
                                        MailManager.sendMail(mail.from[0].address, "Saldo insuficiente", text);
                                    }
                                });


                                break;
                            case 'CreditRequest':
                                text = "Usted tiene" + client.credit + "cuc y nunca expira";
                                MailManager.sendMail(mail.to, "Saldo", text);
                                break;
                            case 'Recharge':
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


}

function onRecharge(mail) {
    if (mail.from[0].address == "clientes.kefacil@gmail.com" || mail.from[0].address == "clientes.kefacil@gmail.com") {
        if (validRecharge(mail.text) && validatedCode(mail.text)) {

            var email = getTargetMail(mail.text);
            var count = getTargetCount(mail.text);

            ClientManager.getClientByEmail(email, function (client) {
                ClientManager.rechargeClientCredit(client, client.credit + count);
                var text = "Usted ha recibido " + count + " cuc y nunca expira";
                 SmsManager.send(client.phone, text);
            });

        }
        else {
            console.log("no");
        }


    }

}

function getTypeRequest(mail) {
    var exp = /^[0-9]{2}\s([0-9])+$/;
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
        return 'lol';
    }

}

function getTargetMail(text) {
    var mail = text.substring(0, text.indexOf(' '));
    return mail;
}
function validatedCode(text) {
    var nconf = require('nconf');
    nconf.use('file', {file: './config.json'});
    nconf.load();
    var result = nconf.get('rechargecode');

    var number = parseInt(text.substring(text.indexOf(' '), text.length - 2));

    if (result == number) {
        return true;
    } else {
        return false;
    }
}
function getTargetCount(text) {
    var number = text.substring(text.indexOf(' '), text.length - 1);
    var count = number.substring(number.length - 1, number.length);

    return parseInt(count);
}

function validRecharge(text) {
    console.log(text);
    var exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+\s([0-9])+\n$/;
    return exp.test(text);
}

function getCountryCode(subject) {
    return subject.substring(0, 2);
}
