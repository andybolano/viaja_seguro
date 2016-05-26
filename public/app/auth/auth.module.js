(function () {
    'use strict';

    angular
        .module('app.auth', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'auth/login.html',
                data: {
                    noRequiresLogin: true
                }
            })
    }
})();