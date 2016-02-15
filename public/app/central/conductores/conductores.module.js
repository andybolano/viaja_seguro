(function() {
    'use strict';

    angular
        .module('app.centrales.conductores', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
           .state('centrales_conductores', {
                url: '/centrales/conductores',
                templateUrl: 'central/conductores/showConductores.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Conductores', link:'/centrales/conductores', icon:'airline_seat_recline_normal'},
        ], 'CENTRAL_EMPRESA');
    }
})();