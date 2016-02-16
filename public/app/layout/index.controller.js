(function() {
    'use strict';

    angular
        .module('ViajaSeguro')
        .controller('indexController', indexController);

    function indexController(authService, $location, $state) {
        var vm = this;

        hoy();
        function hoy() {
            var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
            var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
            var f = new Date();
            var hoy = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
            vm.hoy = hoy;
        };

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


