/**
 * Created by tav0 on 6/01/16.
 */
app = angular.module("autenticaionModule", ['ngRoute', 'ui.keypress', 'angular-jwt']);
app.controller('loginController', function($scope, authService) {

    $scope.usuario = {};
    $scope.mensajeError = '';
    $scope.nuevaContrasena = '';
    $scope.nuevaContrasenaConfirmacion = '';
    $scope.contrasenasDiferentes = false;

    $scope.iniciarSesion = function(){
        authService.login($scope.usuario).then(success, error);
        function success(p) {
            var usuario = authService.storeUser(p.data.token);
            if(usuario.estado == -1){
                $("#modalCambiarContrasena").openModal();
            }else {
                redirect(usuario.rol);
            }
        }
        function error(error) {
            console.log('Error en Login', error);
            $scope.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
        }
    }

    function redirect(rol){
        if (rol == 'SUPER_ADM') {
            window.location.href = "../superadmin/view/#/gestionar_empresas";
        } else if (rol == 'EMPRESA') {
            window.location.href = "../empresa/view/#/empresa/conductores";
        } else if (rol == 'CENTRAL_EMPRESA') {
            window.location.href = "../central/view/#/central/asignar/pasajero";
        }
    }

    $scope.comfirmarContrasenas = function(){
        if($scope.nuevaContrasena != $scope.nuevaContrasenaConfirmacion){
            $scope.contrasenasDiferentes = true;
            $scope.formCambiarContrasena.$valid = false;
        }else{
            $scope.contrasenasDiferentes = false;
            $scope.formCambiarContrasena.$valid = true;
        }
    }

    $scope.cambiarContrasena = function(){
        var contrasenas = {
            actual: $scope.usuario.pass,
            nueva: $scope.nuevaContrasena
        }
        authService.updatePassword(authService.currentUser(), contrasenas).then(success, error);
        function success(p) {
                redirect(authService.currentUser().rol);
        }
        function error(error) {
            console.log('Error en Login', error);
            $scope.mensajeError = 'A ocurrido un erro inesperado';
        }
    }

});