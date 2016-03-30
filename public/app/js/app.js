/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var SMS = angular.module("SMS", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"


]);

// application configuration to integrate token into requests
SMS.config(function ($httpProvider) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');

});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SMS.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);


//AngularJS v1.3.x workaround for old style controller declarition in HTML
SMS.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);


/* Setup global settings */
SMS.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
SMS.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);


/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
SMS.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
SMS.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Theme Panel */
SMS.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);


/* Setup Layout Part - Footer */
SMS.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);
SMS.filter('daterange', function ()
{
    return function(conversations, start_date, end_date)
    {
        var result = [];

         if(start_date&&end_date){
             // date filters
             var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
             var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();

             // if the conversations are loaded
             if (conversations && conversations.length > 0)
             {


                 $.each(conversations, function (index, conversation)
                 {
                     var conversationDate = new Date(conversation.created).getTime();

                     if (conversationDate >= start_date && conversationDate <= end_date)
                     {
                         result.push(conversation);
                     }
                     
                 });

                 return result;
             }
         }
        else{
             return conversations;
         }


    };
});
/* Setup Rounting For All Pages */
SMS.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");


    $stateProvider

    // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "/app/views/dashboard.html",
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/controllers/LoginController.js',
                            '/app/js/services/authService.js',
                            '/assets/admin/pages/css/tasks.css',
                            '/app/js/controllers/DashboardController.js',

                        ]
                    });
                }]
            }
        })
        //login
        .state('login', {
            url: "/login",
            templateUrl: "/app/views/login.html",
            data: {pageTitle: 'Login'},
            controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/controllers/LoginController.js'
                        ]
                    });
                }]
            }
        })
        //Users
        .state('users', {
            url: "/users",
            templateUrl: "/app/views/users.html",
            data: {pageTitle: 'Users'},
            controller: "userController",
            controllerAs: "user",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/userService.js',
                            '/app/js/controllers/UserController.js'
                        ]
                    });
                }]
            }
        })
        .state('userscreate', {
            url: "/users/create",
            templateUrl: "/app/views/single_user.html",
            data: {pageTitle: 'Users'},
            controller: "userCreateController",
            controllerAs: "user",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/userService.js',
                            '/app/js/controllers/UserController.js'
                        ]
                    });
                }]
            }
        })
        .state('usersedit', {
            url: "/users/:user_id",
            templateUrl: "/app/views/single_user.html",
            data: {pageTitle: 'Users'},
            controller: "userEditController",
            controllerAs: "user",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/userService.js',
                            '/app/js/controllers/UserController.js'
                        ]
                    });
                }]
            }
        })
        .state('client', {
            url: "/clients",
            templateUrl: "/app/views/clients.html",
            data: {pageTitle: 'Clients'},
            controller: "clientController",
            controllerAs: "client",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/clientService.js',
                            '/app/js/controllers/ClientController.js'
                        ]
                    });
                }]
            }
        })
        .state('clientcreate', {
            url: "/clients/create",
            templateUrl: "/app/views/single_client.html",
            data: {pageTitle: 'Clients'},
            controller: "clientCreateController",
            controllerAs: "client",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/clientService.js',
                            '/app/js/controllers/ClientController.js'
                        ]
                    });
                }]
            }
        })
        .state('clientedit', {
            url: "/clients/:client_id",
            templateUrl: "/app/views/single_client.html",
            data: {pageTitle: 'Clients'},
            controller: "clientEditController",
            controllerAs: "client",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/clientService.js',
                            '/app/js/controllers/ClientController.js'
                        ]
                    });
                }]
            }
        })
        .state('clientrequest', {
            url: "/request/:client_id",
            templateUrl: "/app/views/requests.html",
            data: {pageTitle: 'Request'},
            controller: "clientRequestController",
            controllerAs: "request",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/clientService.js',
                            '/app/js/controllers/ClientController.js',
                            '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.css',
                            '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.en-GB.min.js',
                        ]
                    });
                }]
            }
        })
        .state('requests', {
            url: "/requests",
            templateUrl: "/app/views/all_requests.html",
            data: {pageTitle: 'Request'},
            controller: "clientRequestAllController",
            controllerAs: "request",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/clientService.js',
                            '/app/js/controllers/ClientController.js',
                            '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.css',
                            '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.en-GB.min.js',
                        ]
                    });
                }]
            }
        })
        .state('queue', {
            url: "/queues",
            templateUrl: "/app/views/queues.html",
            data: {pageTitle: 'Queues'},
            controller: "queueController",
            controllerAs: "queue",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/queueService.js',
                            '/app/js/controllers/QueueController.js'
                        ]
                    });
                }]
            }
        })
        .state('queuecreate', {
            url: "/queues/create",
            templateUrl: "/app/views/single_queue.html",
            data: {pageTitle: 'Queues'},
            controller: "queueCreateController",
            controllerAs: "queue",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/queueService.js',
                            '/app/js/controllers/QueueController.js'
                        ]
                    });
                }]
            }
        })

        .state('queueedit', {
            url: "/queues/:queue_id",
            templateUrl: "/app/views/single_queue.html",
            data: {pageTitle: 'Queues'},
            controller: "queueEditController",
            controllerAs: "queue",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/queueService.js',
                            '/app/js/controllers/QueueController.js'
                        ]
                    });
                }]
            }
        })

        .state('preci', {
            url: "/precis",
            templateUrl: "/app/views/precis.html",
            data: {pageTitle: 'Precis'},
            controller: "preciController",
            controllerAs: "preci",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/app/js/services/preciService.js',
                            '/app/js/controllers/PreciController.js'
                        ]
                    });
                }]
            }
        })

        .state('precicreate', {
            url: "/precis/create",
            templateUrl: "/app/views/single_preci.html",
            data: {pageTitle: 'Precis'},
            controller: "preciCreateController",
            controllerAs: "preci",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/preciService.js',
                            '/app/js/controllers/PreciController.js'
                        ]
                    });
                }]
            }
        })
        .state('preciedit', {
            url: "/precis/:preci_id",
            templateUrl: "/app/views/single_preci.html",
            data: {pageTitle: 'Queues'},
            controller: "preciEditController",
            controllerAs: "preci",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/services/queueService.js',
                            '/app/js/controllers/QueueController.js'
                        ]
                    });
                }]
            }
        })
        .state('setting', {
            url: "/setting",
            templateUrl: "/app/views/setting.html",
            data: {pageTitle: 'Setting'},
            controller: "settingController",
            controllerAs: "setting",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'SMS',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            '/app/js/controllers/SettingController.js'
                        ]
                    });
                }]
            }
        })

    $locationProvider.html5Mode(true);

}]);

/* Init global settings and run the app */
SMS.run(["$rootScope", "settings", "$state", "Auth", function ($rootScope, settings, $state, Auth) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
        var loggedIn = Auth.isLoggedIn();
        $state.previous = fromState;

        if (!loggedIn) {
            $state.go('login');
        }

    });


}]);