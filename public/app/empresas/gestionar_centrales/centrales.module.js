(function () {
    'use strict';

    angular
        .module('app.empresas.centrales', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_gestion_centrales', {
                url: '/empresa/centrales',
                templateUrl: 'empresas/gestionar_centrales/gestionarCentrales.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Centrales', link: 'app.empresas_gestion_centrales', icon: 'flag'}
        ], 'EMPRESA');
    }
})();