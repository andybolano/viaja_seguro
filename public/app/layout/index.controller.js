(function() {
    'use strict';

    angular
        .module('ViajaSeguro')
        .controller('indexController', indexController);

    function indexController(authService, $location, $state) {
        var vm = this;

        vm.hoy = new Date;

        vm.cerrarSesion = cerrarSesion;
        loadUser();

        function loadUser(){
            if(authService.currentUser()) {
                vm.userImagen = authService.currentUser().imagen;
                if (authService.currentUser().empresa) {
                    vm.userNombre = authService.currentUser().empresa.nombre;
                } else if (authService.currentUser().central) {
                    vm.userNombre = authService.currentUser().central.empresa.nombre + '-' + authService.currentUser().central.ciudad.nombre;
                }
                vm.userRol = authService.currentUser().rol;
            }
        };

        function cerrarSesion(){
            sessionStorage.clear();
            $state.go('login');
        };

    }
})();


