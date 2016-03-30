/**
 * Created by victor on 18/03/16.
 */
SMS.controller('clientController', function(Client) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the Clients at page load
        Client.all()
            .success(function(data) {

                // when all the Clients come back, remove the processing variable
                vm.processing = false;

                // bind the clients that come back to vm.clients
                vm.clients = data;
            });

        // function to delete a client
        vm.deleteClient = function(id) {
            vm.processing = true;

            Client.delete(id)
                .success(function(data) {

                    // get all clients to update the table
                    // you can also set up your api
                    // to return the list of clients with the delete call
                    Client.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.clients = data;
                        });

                });
        };

    })

    // controller applied to client creation page
    .controller('clientCreateController', function(Client,$location) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a client
        vm.saveClient = function() {
            vm.processing = true;
            vm.message = '';

            // use the create function in the clientservice
            Client.create(vm.clientData)
                .success(function(data) {
                    vm.processing = false;
                    vm.clientData = {};
                    vm.message = data.message;
                    $location.path('/clients');
                });

        };

    })
    .controller('clientRequestController', function(Client,$location,$stateParams) {

        var vm = this;
        
        // set a processing variable to show loading things
        vm.processing = true;

        Client.getRequest($stateParams.client_id)
            .success(function(data) {


                vm.processing = false;

                // bind the clients that come back to vm.clients
                vm.requests = data;
            });

    })
    .controller('clientRequestAllController', function(Client,$location) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        Client.getRequestAll()
            .success(function(data) {


                vm.processing = false;

                // bind the clients that come back to vm.clients
                vm.requests = data;
            });

    })

    // controller applied to client edit page
    .controller('clientEditController', function($location,$stateParams, Client) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';
        console.log($stateParams.client_id);
        // get the client data for the client you want to edit
        // $stateParam is the way we grab data from the URL
        Client.get($stateParams.client_id)
            .success(function(data) {
                vm.clientData = data;
            });

        // function to save the client
        vm.saveClient = function() {
            vm.processing = true;
            vm.message = '';

            // call the clientservice function to update
            Client.update($stateParams.client_id, vm.clientData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.clientData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                    $location.path('/clients');
                });
        };

    });
