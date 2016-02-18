(function() {
    'use strict';

    angular
        .module('ejemplo', [])
        .config(config)
        .run(run);

    function config($stateProvider){
        $stateProvider
            .state('ejemplo', {
                url: '/ejemplo',
                templateUrl: 'ejemplo/ejemplo.html',
                data: {
                    onlyAccess: 'all' //['rol']
                }
            });
    };

    function run(appMenu){
        appMenu.addTo([
            {nombre:'Centrales', link:'/empresa/centrales', icon:'flag'},
            {nombre:'Asd', link:'/empresa/centrales', icon:'flag'},
            {nombre:'Centrales', link:'/empresa/centrales', icon:'flag'}
        ], 'asd');
    }
})();