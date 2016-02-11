var uri = "../../public";
var app;
(function () {
    app = angular.module("empresa", ['ngRoute', 'ui.keypress', 'angular-jwt', 'google-maps']);

    app.config(['$routeProvider', '$httpProvider', 'jwtInterceptorProvider', function($routeProvider, $httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = function() {
            return sessionStorage.getItem('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

            $routeProvider
                .when("/home", {
                    templateUrl: 'home.html'
                })
                .when("/empresa/centrales", {
                    templateUrl: 'gestionarCentrales.html'
                })
                .when("/empresa/rutas", {
                    templateUrl: 'gestionarRutas.html'
                })
                .when("/empresa/conductores", {
                    templateUrl: 'showConductor.html'
                })
                .when("/empresa/vehiculos", {
                    templateUrl: 'showVehiculos.html'
                })
                .when("/empresa/clientes", {
                    templateUrl: 'showClientes.html'
                })
                .when("/empresa/deducciones", {
                    templateUrl: 'showDeducciones.html'
                })
                .when("/empresa/pagos_prestaciones", {
                    templateUrl: 'registrarPagosPrestaciones.html'
                })
                .when("/empresa/agendar_actividades", {
                    templateUrl: 'agendarActividades.html'
                })
                 .otherwise({redirectTo: '/'})
        }]);


    app.run(function($rootScope, authService){
        $rootScope.$on('$routeChangeStart', function(){
            authService.checkAuthentication('EMPRESA');
        })
    });

    app.directive('ngEnter', function () {
        return function (scope, elements, attrs) {
            elements.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.filter('ifEmpty', function () {
        return function (input, defaultValue) {
                if (angular.isUndefined(input) || input === null || input === '') {
                return defaultValue;
            }

            return input;
        };
    });

    app.directive('uploaderModel', ['$parse', function ($parse) {
            return{
                restrict: 'A', link:function (scope, iElement, iAttrs) {
                    iElement.on('change', function (e)
                    {
                        $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
                    });
                }
            };

        }]);

    app.filter('cut',function(){
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    app.controller('routEmpresasController', function($scope, authService){
        $scope.menu =[
            {nombre:'Centrales', link:'/empresa/centrales', icon:'flag'},
            {nombre:'Agendar actividades', link:'/empresa/agendar_actividades', icon:'event'},
            {nombre:'Gestionar Rutas', link:'/empresa/rutas', icon:'directions'},
            {nombre:'Gestion de Conductores', link:'/empresa/conductores', icon:'airline_seat_recline_normal'},
            {nombre:'Gestion de Vehiculos', link:'/empresa/vehiculos', icon:'directions_car'},
            {nombre:'Deducciones', link:'/empresa/deducciones', icon:'rate_review'}
        ];
        var servicios = authService.currentUser().empresa.servicios;
        console.log(servicios);
        if(servicios.gestion_pagos){
            $scope.menu.push({nombre:'Prestaciones', link:'/empresa/pagos_prestaciones', icon:'rate_review'})
        }
    });

})();


