var uri = "../../public";
var app;
(function () {
    app = angular.module("superadmin", ['ngRoute', 'ui.keypress', 'angular-jwt']);

    app.config(['$routeProvider', '$httpProvider', 'jwtInterceptorProvider', function ($routeProvider, $httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = function() {
            return sessionStorage.getItem('jwt');
        };

        $httpProvider.interceptors.push('jwtInterceptor');

        $routeProvider
            .when("/home", {
                templateUrl: 'home.html'
            })
            .when("/login", {
                template: '',
                controller:function(){
                        window.location.href = '../../public/login.html';
                    }
            })
            .when("/gestionar_empresas", {
                templateUrl: 'gestionar_empresas.html'
            })
            .otherwise({
                redirectTo: "/default"
            });


    }]);

    app.run(function($rootScope, authService){
        $rootScope.$on('$routeChangeStart', function(){
            authService.checkAuthentication('SUPER_ADM');
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
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                iElement.on('change', function (e) {
                    $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
                });
            }
        };

    }]);


})();

