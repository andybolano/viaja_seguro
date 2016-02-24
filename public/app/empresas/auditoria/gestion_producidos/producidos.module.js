(function () {
    'use strict';

    angular
        .module('app.empresas.producidos', [])
        .config(config);
        //.run(run);

    function config($stateProvider){
        $stateProvider
            .state('app.empresas_auditoria', {
                url: '/empresa/auditoria',
                templateUrl: 'empresas/auditoria/gestion_producidos/producido.html',
                data: {
                    onlyAccess: 'EMPRESA'
                }
            });
    }

    //function run(appMenu){
    //    appMenu.addTo([
    //        {nombre:'Auditoria', link:'app.empresas_gestion_producidos', icon:'rate_review'}
    //    ], 'EMPRESA');
    //}
})();