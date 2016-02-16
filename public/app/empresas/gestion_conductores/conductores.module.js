(function() {
    'use strict';

    angular
        .module('app.empresas.conductores', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('gestion_conductores', {
                url: '/empresa/conductores',
                templateUrl: 'empresas/gestion_conductores/showConductor.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            })
            .state('gestion_conductores.nuevo', {
                url: '/empresa/conductores/crear',
                templateUrl: 'empresas/gestion_conductores/nuevo_conductor.html',
                controller: 'NuevoConductorController',
                controllerAs: 'vm',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Gestion de conductores', link:'/empresa/conductores', icon:'directions_car'}
        ], 'EMPRESA');
    }
})();