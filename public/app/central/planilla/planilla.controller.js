(function () {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .controller('planillaController', planillaController);

    function planillaController(planillasService, $scope, $compile, $timeout, authService) {
        var vm = this;

        vm.imprimir = imprimir;
        vm.verPlanilla = verPlanilla;

        initialize();
        function initialize() {
            cargarPlanillas();
            vm.user = authService.currentUser();
        }

        function cargarPlanillas() {
            vm.planillas = {};
            planillasService.getPlanillas().then(succes, error);
            function succes(response) {
                vm.planillas = response.data.planillas;
                vm.tipo = response.data.tipo;
            }

            function error(error) {
                console.log('Error al cargar las planillas')
            }
        }


        function cargarDatosPlanillaEspecial(central_id, planilla_id) {
            turnosService.obtenerDatosPlanillas(central_id, planilla_id).then(success, error);
            function success(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                if (response.data.tipo == 'especial') {
                    $('#modalPlanillaEspecial').openModal();
                } else {
                    turnosService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
                }
                function successN(response) {
                    vm.planilla = {};
                    vm.planilla = response.data;
                    $('#modalPlanillaNormal').openModal();
                }

                function errorN(response) {
                    console.log('Ocurrio un error !');
                }
            }

            function error(response) {
                console.log('Ocurrio un error !');
            }
        }

        function cargarDatosPlanillaNormal(central_id, planilla_id) {
            turnosService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
            function successN(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                $('#modalPlanillaNormal').openModal();
            }

            function errorN(response) {
                console.log('Ocurrio un error !');
            }
        }

        function cargarDatosPlanillaEspecial(central_id, planilla_id) {
            planillasService.obtenerDatosPlanillas(central_id, planilla_id).then(success, error);
            function success(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                if (response.data.tipo == 'especial') {
                    $('#modalPlanillaEspecial').openModal();
                } else {
                    planillasService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
                }
                function successN(response) {
                    vm.planilla = {};
                    vm.planilla = response.data;
                    $('#modalPlanillaNormal').openModal();
                }

                function errorN(response) {
                    console.log('Ocurrio un error !');
                }
            }

            function error(response) {
                console.log('Ocurrio un error !');
            }
        }

        function cargarDatosPlanillaNormal(central_id, planilla_id) {
            planillasService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
            function successN(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                $('#modalPlanillaNormal').openModal();
            }

            function errorN(response) {
                console.log('Ocurrio un error !');
            }
        }

        function verPlanilla(planilla) {
            vm.planilla = {};
            planillasService.getPlanilla(planilla.id).then(succes, error);
            vm.id = planilla.id;
            function succes(p) {
                if (p.data.tipo == 'especial') {
                    cargarDatosPlanillaEspecial(p.data.central_id, p.data.id)
                } else {
                    cargarDatosPlanillaNormal(p.data.central_id, p.data.id)
                }
                // vm.planilla = p.data;
                // vm.planilla.total = p.data.total;
                // $('#modalPlanilla').openModal();
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
