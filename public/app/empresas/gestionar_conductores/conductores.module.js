(function() {
    'use strict';

    angular
        .module('app.empresas.conductores', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.empresas_gestion_conductores', {
                url: '/empresa/conductores',
                templateUrl: 'empresas/gestionar_conductores/showConductor.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Gestion de conductores', link:'app.empresas_gestion_conductores', icon:'directions_car'}
        ], 'EMPRESA');
    }
})();