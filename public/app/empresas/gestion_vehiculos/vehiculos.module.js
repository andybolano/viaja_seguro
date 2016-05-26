(function () {
    'use strict';

    angular
        .module('app.empresas.vehiculos', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_gestion_vehiculos', {
                url: '/empresa/vehiculos',
                templateUrl: 'empresas/gestion_vehiculos/showVehiculos.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Gestion de vehiculos', link: 'app.empresas_gestion_vehiculos', icon: 'directions_car'}
        ], 'EMPRESA');
    }
})();