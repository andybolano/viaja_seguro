(function () {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .service('planillasService', planillasService);

    function planillasService($http, authService, API) {
        this.getPlanillas = function () {
            var req = $http.get(API + '/centrales/' + authService.currentUser().central.id + '/planillas');
            return req;
        }

        this.getPlanilla = function (planilla) {
            return $http.get(API + '/central/' + authService.currentUser().central.id + '/pagos/planilla/' + planilla);
        }

        this.obtenerDatosPlanillas = function (central_id, planilla_id) {
            return $http.get(API + '/centrales/'+central_id+'/planillaEspecial/'+planilla_id);
        }

        this.obtenerDatosPlanillasNormal = function (central_id, planilla_id) {
            return $http.get(API + '/centrales/'+central_id+'/planillaNormal/'+planilla_id);
        }
    }
})();
