/**
 * Created by Jose Soto
 * on 28/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.pasajeros', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.centrales_pasajeros', {
                url: '/centrales/pasajeros',
                templateUrl: 'central/pasajeros/pasajeros.html',
                controller : 'pasajerosController',
                controllerAs : 'vm',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Pasajeros', link: 'app.centrales_pasajeros', icon: 'person_add'},
        ], 'CENTRAL_EMPRESA');
    }
})();
