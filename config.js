module.exports = {
    port: process.env.PORT || 5901,
    database: 'mongodb://localhost:27017/example',
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
