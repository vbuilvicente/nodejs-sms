// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express');		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan = require('morgan'); 		// used to see requests
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var CronJob = require('cron').CronJob;
var InitConfig =require('./init');


// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console 
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.createConnection(config.database);
//setup database
//require('./app/models/models')(mongoose);
var RequestManager = require('./app/controllers/RequestManager');


app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API =================
var apiRoutes = require('./routes')(app, express);
app.use('/api', apiRoutes);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});
var MailManager = require('./app/util/MailManager');
var timeZone = 'America/Havana';
var job = new CronJob('00 30 11 * * *', function () {
        var last = new Date();
        var firt = new Date();
        firt.setDate(last.getDate() - 1);

        RequestManager.getRequestsRange(firt, last, function (result) {
            var text = "Cantidad de peticiones " + result[0].count + " y saldo " + result[0].credit;
            MailManager.sendMail('olshdecuba@gmail.com','Report',text);
        });

    }, null,
    true,
    timeZone
);




// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES

// var User = mongoose.model('User');
// var user = new User();
// user.name = "admin";
// user.username = "admin";
// user.password = "admin";
//
// user.save(function (err) {
//     if (err) {
//         // duplicate entry
//         if (err.code == 11000)
//             console.log('Create admin user error');
//         return false;
//
//     }
//     else{
//         console.log('Created admin successful ');
//         return true;
//     }
// });

// START THE SERVER
// ====================================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.listen(config.port);
console.log('Run ' + config.port);