(function() {
    'use strict';

    angular
        .module('app.centrales.conductores')
        .controller('conductoresController', conductorController);

    function conductorController(conductoresService) {
        var vm = this;
        vm.Conductores = {};

        initialize();

        function initialize(){
            vm.Conductores = {}
            cargarConductores();
        }

        function cargarConductores() {
            var promiseGet = conductoresService.getAll();

            promiseGet.then(function (p) {
                vm.Conductores = p.data;
            },function (errorPl) {
                console.log('Error al cargar los conductores de la central', errorPl);
            });
        }

    }
})();