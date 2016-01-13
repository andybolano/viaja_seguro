var uri = "../../public";
var app;
(function () {
    app = angular.module("empresa", ['ngRoute', 'ui.keypress']);

    app.config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider) {
            $routeProvider.when("/home", {
                templateUrl: 'home.html'
                })
                .when("/empresa/centrales", {
                    templateUrl: 'gestionarCentrales.html'
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
                .when("/empresa/asignar/pasajero", {
                    templateUrl: 'servicioPasajero.html'
                })
                .when("/empresa/asignar/giros", {
                    templateUrl: 'servicioGiro.html'
                })
                .when("/empresa/asignar/paquetes", {
                    templateUrl: 'servicioPaquete.html'
                })
                .when("/empresa/pagos/planilla", {
                    templateUrl: 'showPagosPlanilla.html'
                })
                .when("/empresa/pagos/ahorro", {
                    templateUrl: 'showPagosAhorro.html'
                })
                .when("/empresa/pagos/pension", {
                    templateUrl: 'showPagosPension.html'
                })
                .when("/empresa/pagos/seguridad", {
                    templateUrl: 'showPagosSeguridad.html'
                })
                 .otherwise({redirectTo: '/home'})
        }]);


    app.run(function($rootScope, $location){
        $rootScope.$on('$routeChangeStart', function(){
            var usuario = JSON.parse(sessionStorage.getItem('usuario'));
            var owner = 'userempresa';
            if(!usuario || usuario.rol != owner){
                window.location.href = '../../public/login.html';
            }
            if(($location.path() === '/login') && usuario.rol == owner){
                $location.path('/home');
            }
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
                restrict: 'A',
                link: function (scope, iElement, iAttrs) {
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



})();


