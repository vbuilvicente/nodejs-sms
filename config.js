module.exports = {
    port: process.env.PORT || 5901,
    database: 'mongodb://vbuilvicente:S0l0y0lol@ds011860.mlab.com:11860/nodejs-sms',
    secret: 'ilovescotchscotchyscotchscotch',
    smtpConfig: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'clientes.kefacil@gmail.com',
            pass: 'Dsagales0312'
        }
    },
    sms: {
        user: 'Orlando0312',
        pass: 'Dsagales0312',
    },
  

};
