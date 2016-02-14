(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .service('planillasService', planillasService);

    function planillasService($http, authService){
        this.getPagoPlanilla = function(){
            var req = $http.get(uri+'/api/centrales/'+authService.currentUser().central.id+'/planillas');
            return req;
        }

        this.getPlanilla = function(viaje){
            return $http.get(uri+ '/api/empresa/pagos/planilla/'+viaje);
        }

        this.getDeducciones = function(){
            return $http.get(uri + '/api/empresas/'+ authService.currentUser().central.empresa.id+'/deducciones');
        }
    }
})();
