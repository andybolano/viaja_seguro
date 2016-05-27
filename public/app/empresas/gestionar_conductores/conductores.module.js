(function () {
    'use strict';

    angular
        .module('app.empresas.conductores', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_gestion_conductores', {
                url: '/empresa/conductores',
                templateUrl: 'empresas/gestionar_conductores/showConductor.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            })
            .state('app.empresas_nuevo_conductor', {
                url: '/empresa/conductores/nuevo',
                templateUrl: 'empresas/gestionar_conductores/detalles_conductor.html',
                controller: 'ConductorNuevoController as vm',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            })
            .state('app.empresas_detalles_conductor', {
                url: '/empresa/conductores/:conductor_id',
                templateUrl: 'empresas/gestionar_conductores/detalles_conductor.html',
                controller: 'ConductorDetallesController as vm',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Gestion de conductores', link: 'app.empresas_gestion_conductores', icon: 'person'}
        ], 'EMPRESA');
    }
})();