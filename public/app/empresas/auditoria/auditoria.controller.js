(function () {
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .controller('auditoriaController', auditoriaController);

    function auditoriaController(centralesService, auditoriaService, $filter, planillasService) {
        var vm = this;
        vm.selectedChanged = selectedChanged;
        vm.producidosFecha = producidosFecha;
        vm.producidosVehiculo = producidosVehiculo;
        vm.producidosTodosVehiculo = producidosTodosVehiculo;
        vm.verPlanilla = verPlanilla;
        vm.imprimir = imprimir;

        initialize();
        function initialize() {
            loadCentrales();
            vm.fechaF = null;
            vm.fechaI = null;
        }

        function loadCentrales() {
            if (!vm.centrales) {
                centralesService.getAll().then(success, error);
            }
            function success(p) {
                vm.centrales = p.data;
            }

            function error(error) {
                console.log('Error al cargar centrales');
            }
        }

        function selectedChanged() {
            vm.mostra = true;
            vm.producidos_fecha = [];
            vm.todo = false;
        }

        function producidosFecha(fechaI, fechaF) {
            vm.fechaI = fechaI;
            vm.fechaF = fechaF;
            var obj = {
                fechaI: vm.fechaI,
                fechaF: vm.fechaF
            };
            // console.log(obj);

            auditoriaService.getProducidosFecha(vm.central.id, obj).then(success, error);
            function success(p) {
                vm.total = 0.0;
                vm.producidos_fecha = [];
                vm.cantidad = p.data.length;
                if (p.data.length <= 0) {
                    vm.todo = false;
                    vm.mensaje = 'NO SE REGISTRA ACTIVIDAD PARA LAS FECHAS ESCOGIDAS';
                } else {
                    vm.todo = true;
                    for (var i = 0; i < p.data.length; i++) {
                        vm.producidos_fecha.push(p.data[i]);
                        vm.total += parseFloat(p.data[i].total);
                    }
                }
            }

            function error(error) {
                console.log('Error al obtener los datos');
            }
        }

        function producidosVehiculo(codigo_vial) {

        }

        function producidosTodosVehiculo() {
        }

        function verPlanilla(planilla) {
            planillasService.getPlanilla(planilla.id).then(succes, error);
            function succes(p) {
                vm.planilla = {};
                vm.planilla = p.data;
                vm.planilla.total = p.data.total;
                $('#modalPlanilla').openModal();
            }

            function error(e) {
                console.log('Error al cargar la planilla', e);
            }
        }

        function imprimir() {
            var headstr = "<html ><head><title>Imprimir</title></head><body style='color: white'>";
            var footstr = "</body>";
            var newstr = document.getElementById('contenidoplanillaespecial').innerHTML;
            var oldstr = document.body.innerHTML;
            document.body.innerHTML = headstr+newstr+footstr;
            window.print();
            window.close();
            // document.body.innerHTML = oldstr;
            location.reload();
        }

        vm.imprimirNormal = function () {
            var headstr = "<html ><head><title>Imprimir</title></head><body style='color: white'>";
            var footstr = "</body>";
            var newstr = document.getElementById('page-wrap').innerHTML;
            var oldstr = document.body.innerHTML;
            document.body.innerHTML = headstr+newstr+footstr;
            window.print();
            window.close();
            // document.body.innerHTML = oldstr;
            location.reload();
        }
    }
})();