(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .service('planillasService', planillasService);

    function planillasService($http, authService, API){
        this.getPlanillas = function(){
            var req = $http.get(API+'/centrales/'+authService.currentUser().central.id+'/planillas');
            return req;
        }

        this.getPlanilla = function(viaje){
            return $http.get(API+ '/empresa/pagos/planilla/'+viaje);
        }

        this.getDeducciones = function(){
            return $http.get(API + '/empresas/'+ authService.currentUser().central.empresa.id+'/deducciones');
        }
    }
})();
