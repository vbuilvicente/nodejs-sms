/**
 * Created by victor on 18/03/16.
 */
SMS.controller('preciController', function(Preci) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the preci at page load
        Preci.all()
            .success(function(data) {

                // when all the preci come back, remove the processing variable
                vm.processing = false;

                // bind the preci that come back to vm.preci
                vm.precis = data;
            });

        // function to delete a queu
        vm.deletePreci = function(id) {
            console.log(id);
            vm.processing = true;

            Preci.delete(id)
                .success(function(data) {

                    // get all preci to update the table
                    // you can also set up your api
                    // to return the list of preci with the delete call
                    Preci.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.precis = data;
                        });

                });
        };

    })

    // controller applied to queu creation page
    .controller('preciCreateController', function(Preci,$location) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a queu
        vm.savePreci = function() {
            vm.processing = true;
            vm.message = '';

            // use the create function in the preciervice

            Preci.create(vm.preciData)
                .success(function(data) {
                    vm.processing = false;
                    vm.preciData = {};
                    vm.message = data.message;
                    $location.path('/precis');
                });

        };

    })

    // controller applied to queu edit page
    .controller('preciEditController', function($location,$stateParams, Preci) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';
        console.log($stateParams.preci_id);
        // get the queu data for the queu you want to edit
        // $stateParam is the way we grab data from the URL
        Preci.get($stateParams.preci_id)
            .success(function(data) {
                vm.preciData = data;
            });

        // function to save the queu
        vm.savePreci = function() {
            vm.processing = true;
            vm.message = '';

            // call the preciervice function to update
            Preci.update($stateParams.preci_id, vm.preciData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.preciData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                    $location.path('/precis');
                });
        };

    });