/**
 * Created by tav0 on 6/01/16.
 */
app = angular.module("autenticaionModule", ['ngRoute', 'ui.keypress']);
app.controller('loginController', function($scope, loginService) {

    $scope.usuario = {};
    $scope.mensajeError = '';

    $scope.iniciarSesion = function(){
        loginService.login($scope.usuario).then(success, error);
        function success(p) {
            Materialize.toast("Usuario auntenticado",4000);
            var usuario = p.data;
            sessionStorage.setItem("usuario",JSON.stringify(usuario));

            if(usuario.rol == 'superadmin') {
                window.location.href = "../superadmin/view/#/gestionar_empresas";
            }else if(usuario.rol == 'userempresa') {
                window.location.href = "../empresa/view/#/empresa/conductores";
            }
        }
        function error(error) {
            console.log('Error en Login', error);
            $scope.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
        }
    }

});