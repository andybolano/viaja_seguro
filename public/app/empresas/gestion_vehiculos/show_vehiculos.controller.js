(function () {
    'use strict';

    angular
        .module('app.empresas.vehiculos')
        .controller('vehiculosController', vehiculosController);

    function vehiculosController(vehiculosService) {
        var vm = this;
        vm.vehiculo = {};
        vm.modificar = modificar;
        init();
        function init() {
            vm.Vehiculo = {}
            cargarVehiculos();
        }

        function cargarVehiculos() {
            vm.Vehiculos = [];
            var promiseGet = vehiculosService.getAll();
            promiseGet.then(function (pl) {
                vm.Vehiculos = pl.data;
                Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
            }, function (errorPl) {
                Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
            });
        }

        function modificar(vehiculo) {
            //vm.editMode = true;
            vm.titulo = "VEHICULO CON PLACA: " + vehiculo.placa;
            vm.active = "active";
            vm.Vehiculo = vehiculo;
            $("#modalNuevoVehiculo").openModal();
        };

    }
})();