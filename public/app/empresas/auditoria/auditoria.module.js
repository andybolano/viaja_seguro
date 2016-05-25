(function () {
    'use strict';

    angular
        .module('app.empresas.auditoria', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.empresas_auditoria', {
                url: '/empresa/auditoria',
                templateUrl: 'empresas/auditoria/auditoria.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Auditoria', link: 'app.empresas_auditoria', icon: 'domain'}
        ], 'EMPRESA');
    }
})();