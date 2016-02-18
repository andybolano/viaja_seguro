(function() {
    'use strict';

    angular
        .module('app.superadmin.empresas', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.superadmin_empresas', {
                url: '/gestionar_empresas',
                templateUrl: 'superadmin/gestionar_empresas/gestionar_empresas.html',
                data: {
                    onlyAccess: 'SUPER_ADM' //['rol']
                }
            })
            .state('app.superadmin_empresas_centrales', {
                url: '/gestionar_empresas/:id/centrales',
                templateUrl: 'superadmin/gestionar_empresas/centrales_empresa.html',
                data: {
                    onlyAccess: 'SUPER_ADM' //['rol']
                }
            });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Gestionar Empresas', link:'app.superadmin_empresas', icon:'perm_identity'}
        ], 'SUPER_ADM');
    }
})();