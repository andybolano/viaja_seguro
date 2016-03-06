/**
 * Created by tav0 on 4/01/16.
 */

(function() {
    'use strict';

    angular
        .module('app.centrales.notificaciones')
        .service('notificacionesService', notificacionesService);

    function notificacionesService($http, authService, API) {
        this.getAll = function () {
            return $http.get(API+'/empresas/' + authService.currentUser().central.empresa.id + '/agenda_actividades');
        }

        this.get = function (id) {
            return $http.get(API+'/empresas/' + authService.currentUser().central.empresa.id + '/agenda_actividades/' + id);
        }

        this.post = function (object) {
            return $http.post(API+'/empresas/' + authService.currentUser().central.empresa.id + '/agenda_actividades', object);
        }

        this.put = function (object, id) {
            return $http.put(API+'/agenda_actividades' + '/' + object.id, object);
        }
    }

})();