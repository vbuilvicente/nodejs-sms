var mongoose   = require('mongoose');
var config 	   = require('./config');
mongoose.connect(config.database);
require('./app/models/models')(mongoose);
var User = mongoose.model('User');
var user = new User();
user.name = "admin";
user.username = "admin";
user.password = "admin";

user.save(function (err) {
    if (err) {
        // duplicate entry
        if (err.code == 11000)
            console.log('Create admin user error');
        return false;

    }
    else{
        console.log('Created admin successful ');
        return true;
    }




});