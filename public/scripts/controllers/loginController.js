/**
 * Created by tav0 on 6/01/16.
 */
app = angular.module("autenticaionModule", ['ngRoute', 'ui.keypress', 'angular-jwt']);
app.controller('loginController', function($scope, authService, jwtHelper) {

    $scope.usuario = {};
    $scope.mensajeError = '';

    $scope.iniciarSesion = function(){
        authService.login($scope.usuario).then(success, error);
        function success(p) {
            var usuario = authService.storeUser(p.data.token);
            if(usuario.rol == 'SUPER_ADM') {
                window.location.href = "../superadmin/view/#/gestionar_empresas";
            }else if(usuario.rol == 'EMPRESA') {
                window.location.href = "../empresa/view/#/empresa/conductores";
            }else  if(usuario.rol == 'CENTRAL_EMPRESA'){
                window.location.href = "../central/view/#/central/asignar/pasajero";
            }
        }
        function error(error) {
            console.log('Error en Login', error);
            $scope.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
        }
    }

});