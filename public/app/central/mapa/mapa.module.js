(function() {
    'use strict';

    angular
        .module('app.centrales.mapa', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
           .state('app.centrales_mapa', {
                url: '/centrales/conductores/ubicaciones',
                templateUrl: 'central/mapa/ubicaciones.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Mapa', link:'app.centrales_mapa', icon:'satellite'},
        ], 'CENTRAL_EMPRESA');
    }
})();