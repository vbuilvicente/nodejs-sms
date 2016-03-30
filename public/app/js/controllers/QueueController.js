/**
 * Created by victor on 18/03/16.
 */
SMS.controller('queueController', function(Queue) {

        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the queue at page load
        Queue.all()
            .success(function(data) {

                // when all the queue come back, remove the processing variable
                vm.processing = false;

                // bind the queue that come back to vm.queue
                vm.queues = data;
            });

        // function to delete a queu
        vm.deleteQueue = function(id) {
            console.log(id);
            vm.processing = true;

            Queue.delete(id)
                .success(function(data) {

                    // get all queue to update the table
                    // you can also set up your api
                    // to return the list of queue with the delete call
                    Queue.all()
                        .success(function(data) {
                            vm.processing = false;
                            vm.queues = data;
                        });

                });
        };

    })

    // controller applied to queu creation page
    .controller('queueCreateController', function(Queue,$location) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'create';

        // function to create a queu
        vm.saveQueue = function() {
            vm.processing = true;
            vm.message = '';

            // use the create function in the queueervice
            Queue.create(vm.queueData)
                .success(function(data) {
                    vm.processing = false;
                    vm.queueData = {};
                    vm.message = data.message;
                    $location.path('/queues');
                });

        };

    })

    // controller applied to queu edit page
    .controller('queueEditController', function($location,$stateParams, Queue) {

        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the queu data for the queu you want to edit
        // $stateParam is the way we grab data from the URL
        Queue.get($stateParams.queue_id)
            .success(function(data) {
                vm.queueData = data;
                console.log('data',data);
            });

        // function to save the queu

        vm.saveQueue = function() {
            vm.processing = true;
            vm.message = '';

            // call the queueervice function to update
            Queue.update($stateParams.queue_id, vm.queueData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.queueData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                    $location.path('/queues');
                });
        };

    });