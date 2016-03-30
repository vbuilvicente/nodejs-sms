'use strict';
SMS.controller('loginController', function ($rootScope, $location, $scope, Auth, $state) {
    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();


    // check to see if a user is logged in on every request
    $rootScope.$on('$stateChangeSuccess', function () {
        vm.loggedIn = Auth.isLoggedIn();

        // get user information on page load
        Auth.getUser()
            .then(function (data) {
                vm.user = data.data;

            });

    });

    // function to handle login form
    vm.doLogin = function () {

        vm.processing = true;

        // clear the error
        vm.error = '';

        Auth.login(vm.username, vm.password)
            .success(function (data) {
                vm.processing = false;

                // if a user successfully logs in, redirect to users page
                if (data.success)
                {
                    $state.go($state.previous);
                    $rootScope.$state = $state
                }

                else
                    vm.error = data.message;

            });
    };

    // function to handle logging out
    vm.doLogout = function () {
        Auth.logout();
        vm.user = '';
        $state.go('login');
        $rootScope.$state = $state
    };


});
