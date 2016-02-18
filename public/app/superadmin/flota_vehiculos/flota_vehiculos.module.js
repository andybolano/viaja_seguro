(function() {
    'use strict';

    angular
        .module('app.superadmin.flota_vehiculos', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.superadmin_flota_vehiculos', {
                url: '/flota_vehiculos',
                templateUrl: 'superadmin/flota_vehiculos/showVehiculos.html',
                data: {
                    onlyAccess: 'SUPER_ADM' //['rol']
                }
            });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Flota Vehiculos', link:'app.superadmin_flota_vehiculos', icon:'directions_car'}
        ], 'SUPER_ADM');
    }
})();