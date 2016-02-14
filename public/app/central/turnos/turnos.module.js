(function() {
    'use strict';

    angular
        .module('app.centrales.turnos', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('centrales.turnos', {
                url: '/centrales/turnos',
                templateUrl: 'central/turnos/gestionarTurnos.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Despacho conductores', link:'/centrales/turnos', icon:'supervisor_account'},
        ], 'CENTRAL_EMPRESA');
    }
})();