(function() {
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .controller('auditoriaController', auditoriaController);

    function auditoriaController(centralesService, auditoriaService, $filter) {
        var vm = this;
        vm.selectedChanged = selectedChanged;
        vm.producidosFecha = producidosFecha;
        vm.producidosVehiculo = producidosVehiculo;
        vm.producidosTodosVehiculo = producidosTodosVehiculo;

        initialize();
        function initialize(){
            loadCentrales();
            vm.fechaF = null;
            vm.fechaI = null;
        }

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
            vm.producidos_fecha = [];
            vm.todo = false;
        }

        function producidosFecha(fechaI, fechaF){
            vm.fechaI = fechaI;
            vm.fechaF = fechaF;
            vm.total = 0;
            var obj = {
                fechaI : vm.fechaI,
                fechaF :vm.fechaF
            };
            console.log(obj);

            auditoriaService.getProducidosFecha(vm.central.id, obj).then(success, error);
            function success(p){
                vm.todo = true;
                vm.producidos_fecha = [];
                vm.cantidad = p.data.length;
                for(var i = 0; i<p.data.length; i++){
                    vm.producidos_fecha.push(p.data[i]);
                    vm.total += p.data[i].total;
                }
            }
            function error(error){
                console.log('Error al obtener los datos', error);
            }
        }

        function producidosVehiculo(vehiculo_id){}

        function producidosTodosVehiculo(){}

    }
})();