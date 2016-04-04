'use strict';

var jwt = require('jsonwebtoken');
var config = require('./config');
var superSecret = config.secret;
var Security = require('./app/controllers/Security');
var UserManager = require('./app/controllers/UserManager');
var ClientManager = require('./app/controllers/ClientManager');
var QueueManager = require('./app/controllers/QueueManager');
var PreciManager = require('./app/controllers/PreciManager');
var SettingManager = require('./app/controllers/SettingManager');
var RequestManager = require('./app/controllers/RequestManager');
var Main = require('./app/util/Main');


exports = module.exports = function (app, express) {
    var apiRouter = express.Router();


    apiRouter.post('/login', Security.Login);

    apiRouter.use(function (req, res, next) {

        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });
    apiRouter.get('/', function (req, res) {
        res.json({message: 'hooray! welcome to our api!'});
    });
    apiRouter.route('/users')
        .post(UserManager.createUser)
        .get(UserManager.getUsers);
    apiRouter.route('/users/:user_id')
        .get(UserManager.getUser)
        .put(UserManager.updateUser)
        .delete(UserManager.deleteUser);
    apiRouter.route('/client/')
        .post(ClientManager.createClient)
        .get(ClientManager.getClients);
    apiRouter.route('/client/:client_id')
        .get(ClientManager.getClient)
        .put(ClientManager.updateClient)
        .delete(ClientManager.deleteClient);
    apiRouter.get("/requestbyclient/:client_id", RequestManager.getRequestsByClient);
    apiRouter.get("/requests",RequestManager.getRequests);
    apiRouter.route('/queue/')
        .post(QueueManager.createQueue)
        .get(QueueManager.getQueues);
    apiRouter.route('/queue/:queue_id')
        .get(QueueManager.getQueue)
        .put(QueueManager.updateQueue)
        .delete(QueueManager.deleteQueue);
    apiRouter.get("/restart", function (req, res) {
        Main.Start();
        res.json({message: 'Run!'});

    });
    apiRouter.get("/stop", function (req, res) {
        Main.Stop();
        res.json({message: 'Stop!'});
    });
    apiRouter.route('/preci/')
        .post(PreciManager.createPreci)
        .get(PreciManager.getPrecis);
    apiRouter.route('/preci/:preci_id')
        .get(PreciManager.getPreci)
        .put(PreciManager.updatePreci)
        .delete(PreciManager.deletePreci);
    apiRouter.route('/setting/')
        .post(SettingManager.saveRechargeCode)
        .get(SettingManager.getRechargeCode);
    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);

    });

    //******** END OF NEW JSON API ********


    return apiRouter;
};
