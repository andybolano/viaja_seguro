/**
 * Created by tav0 on 13/02/16.
 */
(function() {
    'use strict';

    angular
        .module('ViajaSeguro', [
            'commons',
            'ui.router',
            'ui.keypress',
            'angular-jwt',
            //'google-maps',

            //app modules
            'ejemplo',
            'app.auth',
            'app.centrales'
        ])
        .constant('API', '../api')
        .config(config)
        .run(run);

    function config(jwtInterceptorProvider, $httpProvider, $urlRouterProvider){
        jwtInterceptorProvider.tokenGetter = function() {
            return sessionStorage.getItem('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider.when('', '/');
        $urlRouterProvider.when('/', '/login');
        //$urlRouterProvider.otherwise('/login');
    }

    function run($rootScope, $state, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function(e, to) {
            if (!to.data || !to.data.noRequiresLogin) {
                var jwt = sessionStorage.getItem('jwt');
                if (!jwt || jwtHelper.isTokenExpired(jwt)) {
                    e.preventDefault();
                    console.log('token expired');
                    $state.go('login');
                }else if(to.data && to.data.onlyAccess){
                    var user = jwt && jwtHelper.decodeToken(jwt).usuario;
                    console.log('o: '+window.location.hash+'|d: '+to.url+'user_rol: '+user.rol);
                    if (!(!to.data.onlyAccess || to.data.onlyAccess == user.rol || to.data.onlyAccess == 'all')) {
                        e.preventDefault();
                        console.log('token expired');
                        $state.go('login');
                    }
                }
            }
        });
    }

})();