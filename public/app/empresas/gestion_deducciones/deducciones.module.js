(function() {
    'use strict';

    angular
        .module('app.empresas.deducciones', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.empresas_gestion_deducciones', {
                url: '/empresa/deducciones',
                templateUrl: 'empresas/gestion_deducciones/showDeducciones.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Deducciones', link:'app.empresas_gestion_deducciones', icon:'rate_review'}
        ], 'EMPRESA');
    }
})();