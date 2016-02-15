(function() {
    'use strict';

    angular
        .module('app.centrales.mapa', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
           .state('centrales_mapa', {
                url: '/centrales/conductoes/ubicaciones',
                templateUrl: 'central/mapa/ubicaciones.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Mapa', link:'/centrales/conductores/ubicaciones', icon:'satellite'},
        ], 'CENTRAL_EMPRESA');
    }
})();