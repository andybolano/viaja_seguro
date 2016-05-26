(function () {
    'use strict';

    angular
        .module('app.centrales.conductores')
        .controller('conductoresController', conductorController);

    function conductorController(conductoresService) {
        var vm = this;

        initialize();

        function initialize() {
            vm.Conductores = [];
            cargarConductores();
        }

        function cargarConductores() {
            var promiseGet = conductoresService.getAll();

            promiseGet.then(function (p) {
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].activo == true && p.data[i].vehiculo != null) {
                        vm.Conductores.push(p.data[i]);
                    }
                }
            }, function (errorPl) {
                console.log('Error al cargar los conductores de la central', errorPl);
            });
        }

    }
})();