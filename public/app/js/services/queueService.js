SMS.factory('Queue', function($http) {

    // create a new object
    var queueFactory = {};

    // get a single queue
    queueFactory.get = function(id) {
        return $http.get('/api/queue/' + id);
    };

    // get all queue
    queueFactory.all = function() {
        return $http.get('/api/queue/');
    };

    // create a queue
    queueFactory.create = function(queueData) {
        return $http.post('/api/queue/', queueData);
    };

    // update a queue
    queueFactory.update = function(id, queueData) {
        return $http.put('/api/queue/' + id, queueData);
    };

    // delete a queue
    queueFactory.delete = function(id) {
        return $http.delete('/api/queue/' + id);
    };

    // return our entire queueFactory object
    return queueFactory;

});