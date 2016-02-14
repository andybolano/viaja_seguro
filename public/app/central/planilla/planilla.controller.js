(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .controller('planillaController', planillaController);

    function planillaController(planillasService) {
        var vm = this;

        vm.imprimir = imprimir;
        vm.verPlanilla = verPlanilla;

        initialize();
        function initialize(){
            vm.Planilla = {};
            cargarDeducciones();
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
                vm.Planilla = p.data;
                $('#modalPlanilla').openModal();
            }
            function error(){

            }
        }

        function imprimir(){
            var printContents = document.getElementById('planilla').innerHTML;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../public/css/pdf.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }
    }
})();