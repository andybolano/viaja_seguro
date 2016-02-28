(function(){
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .service('auditoriaService', auditoriaService);

    function auditoriaService($http, authService, API) {
        var myAPI = API + '/empresas/'+authService.currentUser().empresa.id+'/centrales/';

        this.getProducidosFecha = function(central_id, obj){
            return $http.post(myAPI +central_id+'/producidos_fecha',obj);
        }

    }


})();