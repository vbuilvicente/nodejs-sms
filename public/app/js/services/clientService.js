/**
 * Created by victor on 18/03/16.
 */


SMS.factory('Client', function($http) {

    // create a new object
    var clientFactory = {};

    // get a single client
    clientFactory.get = function(id) {
        return $http.get('/api/client/' + id);
    };
    // get a request
    clientFactory.getRequest = function(id) {
        return $http.get('/api/requestbyclient/' + id);
    };
    clientFactory.getRequestAll = function(id) {
        return $http.get('/api/requests');
    };

    // get all client
    clientFactory.all = function() {
        return $http.get('/api/client/');
    };

    // create a client
    clientFactory.create = function(clientData) {
        return $http.post('/api/client/', clientData);
    };

    // update a client
    clientFactory.update = function(id, clientData) {
        return $http.put('/api/client/' + id, clientData);
    };

    // delete a client
    clientFactory.delete = function(id) {
        return $http.delete('/api/client/' + id);
    };

    // return our entire clientFactory object
    return clientFactory;

});