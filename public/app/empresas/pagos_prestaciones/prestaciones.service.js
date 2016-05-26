/**
 * Created by tav0 on 4/01/16.
 */

(function () {
    'use strict';

    angular
        .module('app.empresas.pagos_prestaciones')
        .service('prestacionesService', prestacionesService);

    function prestacionesService($http, authService, API) {
        this.getAll = function () {
            return $http.get(API + '/prestaciones');
        }

        this.getPagos = function (prestacion_id) {
            return $http.get(API + '/empresas/' + authService.currentUser().empresa.id + '/pagos_prestaciones/' + prestacion_id);
        }

        this.post = function (object) {
            return $http.post(API + '/conductores/' + object.conductor_id + '/pagos_prestaciones', object);
        }
    }
})();