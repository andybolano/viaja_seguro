/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('loginController', loginController);

    function loginController(authService, $state) {
        var vm = this;

        vm.usuario = {};
        vm.mensajeError = '';
        vm.nuevaContrasena = '';
        vm.nuevaContrasenaConfirmacion = '';
        vm.contrasenasDiferentes = false;

        vm.iniciarSesion = iniciarSesion;
        vm.comfirmarContrasenas = comfirmarContrasenas;
        vm.cambiarContrasena = cambiarContrasena;

        if(authService.currentUser()) redirect(authService.currentUser().rol);

        function iniciarSesion(){
            vm.mensajeError = '';
            authService.login(vm.usuario).then(success, error);
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
                vm.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
            }
        }

        function redirect(rol){
            if (rol == 'SUPER_ADM') {

            } else if (rol == 'EMPRESA') {
                $state.go('gestion_conductores');
            } else if (rol == 'CENTRAL_EMPRESA') {
                $state.go('centrales_turnos');
            }
        }

        function comfirmarContrasenas(){
            vm.mensajeError = '';
            if(vm.nuevaContrasena != vm.nuevaContrasenaConfirmacion){
                vm.contrasenasDiferentes = true;
                vm.formCambiarContrasena.$valid = false;
            }else{
                vm.contrasenasDiferentes = false;
                vm.formCambiarContrasena.$valid = true;
            }
        }

        function cambiarContrasena(){
            var contrasenas = {
                actual: vm.usuario.pass,
                nueva: vm.nuevaContrasena
            }
            authService.updatePassword(authService.currentUser(), contrasenas).then(success, error);
            function success(p) {
                redirect(authService.currentUser().rol);
            }
            function error(error) {
                console.log('Error en Login', error);
                vm.mensajeError = 'A ocurrido un erro inesperado';
            }
        }

    }
})();