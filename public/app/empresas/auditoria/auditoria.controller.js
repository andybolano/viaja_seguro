(function() {
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .controller('auditoriaController', auditoriaController);

    function auditoriaController(centralesService) {
        var vm = this;
        vm.optionsCentral = optionsCentral;
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

        function optionsCentral(){
            vm.mostra = true;
        }

    }
})();