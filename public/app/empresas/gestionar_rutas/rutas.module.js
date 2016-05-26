(function () {
    'use strict';

    angular
        .module('app.empresas.rutas', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_gestion_rutas', {
                url: '/empresa/rutas',
                templateUrl: 'empresas/gestionar_rutas/gestionarRutas.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Gestionar rutas', link: 'app.empresas_gestion_rutas', icon: 'directions'}
        ], 'EMPRESA');
    }
})();