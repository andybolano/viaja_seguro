(function() {
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .controller('auditoriaController', auditoriaController);

    function auditoriaController(centralesService) {
        var vm = this;
        vm.selectedChanged = selectedChanged;
        vm.producidosFecha = producidosFecha;
        vm.producidosVehiculo = producidosVehiculo;
        vm.producidosTodosVehiculo = producidosTodosVehiculo;
        loadCentrales();

        function loadCentrales(){
            if(!vm.centrales) {
                centralesService.getAll().then(success, error);
            }
            function success(p) {
                vm.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar centrales', error);
            }
        }

        function selectedChanged(){
            vm.mostra = true;
        }

        function producidosFecha(){
            vm.central.id *= vm.central.id;
        }

        function producidosVehiculo(vehiculo_id){}

        function producidosTodosVehiculo(){}

    }
})();