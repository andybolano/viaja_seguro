(function() {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .service('conductoresEmpresaService', conductoresService);

    function conductoresService($http, authService, API){

        this.getAll = function  () {
            return $http.get(API+'/empresas/'+authService.currentUser().empresa.id+'/conductores/all');
        }
    }
})();
