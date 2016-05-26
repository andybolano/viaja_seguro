(function () {
    'use strict';

    angular
        .module('app.empresas.pagos_prestaciones', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_pagos_prestaciones', {
                url: '/empresa/pagos_prestaciones',
                templateUrl: 'empresas/pagos_prestaciones/registrarPagosPrestaciones.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    };

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Pagos prestaciones', link: 'app.empresas_pagos_prestaciones', icon: 'speaker_notes'}
        ], 'EMPRESA');
    }
})();