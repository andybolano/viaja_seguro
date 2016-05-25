/**
 * Created by tav0 on 12/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.pagos_prestaciones')
        .controller('PagosPrestacionesController', PagosPrestacionesController);

    function PagosPrestacionesController(prestacionesService, $filter, conductoresEmpresaService) {
        var vm = this;

        vm.prestaciones = [];
        vm.selectedPrestacion = {};
        vm.selectedConductorNombre = '';
        vm.selectedConductorCedula = '';
        vm.pagosPrestacion = [];
        vm.nuevaPrestacion = {};
        vm.prestacionAvtive = false;

        vm.loadPagos = loadPagos;
        vm.nuevo = nuevo;
        vm.guardar = guardar;
        vm.selectConductor = selectConductor;
        vm.buscarConductor = buscarConductor;

        loadPrestaciones();

        function loadPagos(prestacion) {
            vm.prestacionAvtive = true;
            vm.selectedPrestacion = prestacion;
            prestacionesService.getPagos(vm.selectedPrestacion.id).then(success, error);
            function success(p) {
                vm.pagosPrestacion = p.data;
            }

            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function loadConductores() {
            if (!vm.conductores) {
                conductoresEmpresaService.getAll().then(success, error);
            }
            function success(p) {
                vm.conductores = [];
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].activo == true) {
                        vm.conductores.push(p.data[i]);
                    }
                }
            }

            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function nuevo() {
            vm.nuevaPrestacion = {};
            vm.nuevaPrestacion.fecha = new Date();
            loadConductores();
            $("#modalRegistrarPago").openModal();
        }

        function guardar() {
            vm.nuevaPrestacion.prestacion_id = vm.selectedPrestacion.id;
            vm.nuevaPrestacion.fecha = $filter('date')(vm.nuevaPrestacion.fecha, 'yyyy-MM-dd');
            prestacionesService.post(vm.nuevaPrestacion).then(success, error);
            function success(p) {
                loadPagos(vm.selectedPrestacion);
                $("#modalRegistrarPago").closeModal();
                Materialize.toast('Registro guardado correctamente', 5000);
            }

            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function buscarConductor() {
            vm.selectedConductor = {};
            vm.selectedConductorNombre = '';
            $("#modalBuscarconductor").openModal();
        }

        function loadPrestaciones() {
            prestacionesService.getAll().then(success, error);
            function success(p) {
                vm.prestaciones = p.data;
            }

            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function selectConductor(conductor) {
            vm.selectedConductorNombre = conductor.nombres + ' ' + conductor.apellidos;
            vm.selectedConductorCedula = conductor.identificacion;
            vm.nuevaPrestacion = {
                conductor_id: conductor.id
            };
            $("#modalBuscarconductor").closeModal();
        }
    }
})();