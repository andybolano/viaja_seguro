(function() {
    'use strict';

    angular
        .module('app.centrales.notificaciones', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.centrales_notificaciones', {
                url: '/central/notificaciones',
                templateUrl: 'central/notificaciones/notificaciones.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Notificaciones', link:'app.centrales_notificaciones', icon:'event'}
        ], 'CENTRAL_EMPRESA');
    }
})();