(function () {
    'use strict';

    angular
        .module('app.centrales.turnos', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.centrales_turnos', {
                url: '/centrales/turnos',
                templateUrl: 'central/turnos/gestionarTurnos.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Despacho conductores', link: 'app.centrales_turnos', icon: 'supervisor_account'}
        ], 'CENTRAL_EMPRESA');
    }
})();