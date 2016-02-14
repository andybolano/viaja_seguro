(function() {
    'use strict';

    angular
        .module('central', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('central.turnos', {
                url: 'central/turnos',
                templateUrl: 'central/turnos/gestionarTurnos.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA' //['rol']
                }
            })
            .state('central.conductores', {
                url: 'central/conductores',
                templateUrl: 'central/conductores/showConductores.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
            .state('central.ubicaciones', {
                url: 'central/conductores/ubicaciones',
                templateUrl: 'central/mapa/ubicaciones.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
            .state('central.planilla', {
                url: 'central/planillas',
                templateUrl: 'central/planilla/planilla.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Conductores', link:'/central/conductores', icon:'flag'},
            {nombre:'Despacho de conductores', link:'/central/turnos', icon:'flag'},
            {nombre:'Mapa', link:'/central/conductores/ubicaciones', icon:'flag'},
            {nombre:'Planillas', link:'/central/planillas', icon:'flag'},
        ], 'CENTRAL_EMPRESA');
    }
})();