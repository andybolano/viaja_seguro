(function() {
    'use strict';

    angular
        .module('app.centrales.planillas', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
           .state('centrales_planillas', {
                url: '/centrales/planillas',
                templateUrl: 'central/planilla/planilla.html',
                data: {
                    onlyAccess: 'CENTRAL_EMPRESA'
                }
            })
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Planillas', link:'/centrales/planillas', icon:'rate_review'},
        ], 'CENTRAL_EMPRESA');
    }
})();