/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('loginController', loginController);

    function loginController(authService) {
        var vm = this;

        vm.usuario = {};
        vm.mensajeError = '';
        vm.nuevaContrasena = '';
        vm.nuevaContrasenaConfirmacion = '';
        vm.contrasenasDiferentes = false;

        vm.iniciarSesion = iniciarSesion;
        vm.comfirmarContrasenas = comfirmarContrasenas;
        vm.cambiarContrasena = cambiarContrasena;

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
                window.location.href = "../superadmin/view/#/gestionar_empresas";
            } else if (rol == 'EMPRESA') {
                window.location.href = "../empresa/view/#/empresa/conductores";
            } else if (rol == 'CENTRAL_EMPRESA') {
                window.location.href = "../central/view/#/central/turnos";
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