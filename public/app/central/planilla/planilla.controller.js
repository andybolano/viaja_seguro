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
            var ficha = document.getElementById('planilla');
            var ventimp = window.open(' ', 'popimpr');
            ventimp.document.write( ficha.innerHTML );
            ventimp.document.close();
            var css = ventimp.document.createElement("link");
            css.setAttribute("href", "http://dev.viajaseguro.co/public/assets/css/pdf.css");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            ventimp.document.head.appendChild(css);
            ventimp.print( );
            ventimp.close();
        }
    }
})();
