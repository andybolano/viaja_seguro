(function() {
    'use strict';

    angular
        .module('app.empresas.actividades', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.empresas_agendar_actividades', {
                url: '/empresa/actividades',
                templateUrl: 'empresas/actividades/agendarActividades.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Agendar Actividades', link:'app.empresas_agendar_actividades', icon:'event'}
        ], 'EMPRESA');
    }
})();