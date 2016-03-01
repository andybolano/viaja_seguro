(function() {
    'use strict';

    angular
        .module('app.centrales.mapa', ['uiGmapgoogle-maps',])
        .config(config)
        .run(run);

    function config($stateProvider, uiGmapGoogleMapApiProvider){
        $stateProvider
           .state('app.centrales_mapa', {
                url: '/centrales/conductores/ubicaciones',
                templateUrl: 'central/mapa/ubicaciones.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Mapa', link:'app.centrales_mapa', icon:'satellite'},
        ], 'CENTRAL_EMPRESA');
    }
})();