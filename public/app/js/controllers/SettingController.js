// controller applied to user creation page
SMS.controller('settingController', function ($http) {

    var vm = this;

    $http.get('/api/setting/')
        .success(function (data) {
            vm.settingData = data;


        });
    vm.Start = function () {
        vm.run = false;


        $http.get('/api/restart')
            .success(function (data) {
                vm.run = true;
                console.log( vm.run);

            });

    };
    vm.Stop = function () {


        $http.get('/api/stop')
            .success(function (data) {
                vm.run = false;
                console.log( vm.run);

            });

    };
    vm.SaveCode = function () {

        $http.post('/api/setting/',vm.settingData)
            .success(function (data) {


            });

    };

})