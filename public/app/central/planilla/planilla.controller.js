(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .controller('planillaController', planillaController);

    function planillaController(planillasService, $scope, $compile, $timeout) {
        var vm = this;

        vm.imprimir = imprimir;
        vm.verPlanilla = verPlanilla;

        initialize();
        function initialize(){
            cargarPlanillas();
            cargarDeducciones();
        }

        function cargarPlanillas(){
            planillasService.getPlanillas().then(succes, error);
            function succes(response){
                vm.planillas = {};
                vm.planillas = response.data;
            }
            function error(error){
                console.log('Error al cargar las planillas')
            }
        }

        function cargarDeducciones(){
            var promiseGet = planillasService.getDeducciones();
            promiseGet.then(function (pl) {
                vm.Deducciones = pl.data;
            },function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function verPlanilla(planilla){
            planillasService.getPlanilla(planilla.viaje_id).then(succes, error);
            function succes(p){
                vm.planilla = {};
                vm.planilla = p.data;
                vm.planilla.total = p.data.total;
                $('#modalPlanilla').openModal();
            }
            function error(e){
                console.log('Error al cargar la planilla', e);
            }
        }

        function imprimir(){
            var printContents = document.getElementById('page-wrap').innerHTML;
            var popupWin = window.open('', '_blank', '');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" media="print" href="../../../assets/css/pdf.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }
    }
})();
