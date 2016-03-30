SMS.factory('Preci', function($http) {

    // create a new object
    var preciFactory = {};

    // get a single preci
    preciFactory.get = function(id) {
        return $http.get('/api/preci/' + id);
    };

    // get all preci
    preciFactory.all = function() {
        return $http.get('/api/preci/');
    };

    // create a preci
    preciFactory.create = function(preciData) {
        return $http.post('/api/preci/', preciData);
    };

    // update a preci
    preciFactory.update = function(id, preciData) {
        return $http.put('/api/preci/' + id, preciData);
    };

    // delete a preci
    preciFactory.delete = function(id) {
        return $http.delete('/api/preci/' + id);
    };

    // return our entire preciFactory object
    return preciFactory;

});