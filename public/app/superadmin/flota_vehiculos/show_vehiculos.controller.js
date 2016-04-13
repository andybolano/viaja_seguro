(function () {
    'use strict';

    angular
        .module('app.superadmin.flota_vehiculos')
        .controller('VehiculosController', VehiculosController);

    function VehiculosController(vehiculosService, centralesService, empresasService) {
        var vm = this;

        vm.empresas = [];
        vm.centrales = [];
        vm.Vehiculos = [];
        vm.vehiculo = {};
        vm.selectEmpresa = {};
        vm.selectCentral = {}

        vm.active;

        vm.cargarVehiculos = cargarVehiculos;
        vm.cargarVehiculosDeNuevo = cargarVehiculosDeNuevo;

        cargarEmpresas();
        function cargarEmpresas() {
            empresasService.getAll().then(success, error);
            function success(p) {
                vm.empresas = p.data;
            }

            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function cargarCentrales(id) {
            vm.centales = [];
            centralesService.getAll(id).then(success, error);
            function success(p) {
                vm.centrales = p.data;
                vm.centrales.unshift({ciudad: {nombre: 'Todas'}});
                vm.selectedCentral = vm.centrales[0];
            }

            function error(error) {
                console.log('Error al cargar centales');
            }
        }

        function cargarVehiculos(selectEmpresa) {
            vm.selectEmpresa = selectEmpresa;
            var promiseGet = vehiculosService.getFiltering(selectEmpresa.id);
            promiseGet.then(function (pl) {
                vm.Vehiculos = pl.data;
                vm.total_vehiculos = vm.Vehiculos.length;
                Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
                cargarCentrales(selectEmpresa.id);
            }, function (errorPl) {
                Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
            });
        }

        function cargarVehiculosDeNuevo(selectCentral) {
            var promiseGet = (selectCentral.ciudad.nombre == 'Todas') ? vehiculosService.getFiltering(vm.selectEmpresa.id) : vehiculosService.getFiltering(null, selectCentral.id);
            promiseGet.then(function (pl) {
                vm.Vehiculos = pl.data;
                vm.total_vehiculos = vm.Vehiculos.length;
                Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
                init();
            }, function (errorPl) {
                Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
            });
        }

        vm.modificar = function (vehiculo) {
            //vm.editMode = true;
            vm.titulo = "VEHICULO CON PLACA: " + vehiculo.placa;
            vm.active = "active";
            vm.Vehiculo = vehiculo;
            $("#modalNuevoVehiculo").openModal();
        };

    }
})();