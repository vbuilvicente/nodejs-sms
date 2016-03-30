// controller applied to user creation page
SMS.controller('settingController', function ($http) {

    var vm = this;

    $http.get('/api/coderecharge/')
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
      var data={code:parseInt(vm.settingData.code)};

        $http.post('/api/coderecharge/',data)
            .success(function (data) {


            });

    };

})