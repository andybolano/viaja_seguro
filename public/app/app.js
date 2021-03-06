/**
 * Created by tav0 on 13/02/16.
 */
(function () {
    'use strict';

    angular
        .module('ViajaSeguro', [
            'commons',
            'ui.router',
            'ui.keypress',
            'angular-jwt',
            'google-maps',

            //app modules
            'ejemplo',
            'app.auth',
            'app.empresas',
            'app.centrales',
            'app.superadmin'
        ])
        .constant('API', '../api')
        .config(config)
        .run(run);

    function config(jwtInterceptorProvider, $httpProvider, $urlRouterProvider, $stateProvider) {
        jwtInterceptorProvider.tokenGetter = function (jwtHelper, $http, API) {
            var jwt = sessionStorage.getItem('jwt');
            if (jwt) {
                if (jwtHelper.isTokenExpired(jwt)) {
                    return $http({
                        url: API + '/new_token',
                        skipAuthorization: true,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + jwt},
                    }).then(function (response) {
                        sessionStorage.setItem('jwt', response.data.token);
                        return response.data.token;
                    }, function (response) {
                        sessionStorage.removeItem('jwt');
                    });
                } else {
                    return jwt;
                }
            }
        };

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider.when('', '/');
        $urlRouterProvider.when('/', '/login');
        //$urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '',
                templateUrl: 'layout/layout.html',
                controller: 'indexController as vm'
            });
    }

    function run($rootScope, $state, jwtHelper, notificacionService) {
        notificacionService.pusher();
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (!to.data || !to.data.noRequiresLogin) {
                var jwt = sessionStorage.getItem('jwt');
                if (!jwt || jwtHelper.isTokenExpired(jwt)) {
                    e.preventDefault();
                    // console.log('token expired');
                    $state.go('login');
                } else if (to.data && to.data.onlyAccess) {
                    var user = jwt && jwtHelper.decodeToken(jwt).usuario;
                    // console.log('o: '+window.location.hash+'|d: '+to.url+'user_rol: '+user.rol);
                    if (!(!to.data.onlyAccess || to.data.onlyAccess == user.rol || to.data.onlyAccess == 'all')) {
                        e.preventDefault();
                        // console.log('token expired');
                        $state.go('login');
                    }
                }
            }
        });
    }

})();
