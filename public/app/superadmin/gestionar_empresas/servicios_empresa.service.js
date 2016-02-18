/**
 * Created by tav0 on 4/01/16.
 */

(function() {
    'use strict';

    angular
        .module('app.empresas.actividades')
        .service('serviciosEmpresaService', serviciosEmpresaService);

    function serviciosEmpresaService($http, API) {
        this.getAll = function () {
            return $http.get(API+'/servicios_empresa');
        }

        this.get = function (id) {
            return $http.get(API+'/empresa/' + id);
        }

        this.post = function (object) {
            return $http.post(API+'/servicios_empresa', object);
        }

        this.put = function (object, id) {
            return $http.put(API+'/empresa/' + id, object);
        }

        this.delete = function (id) {
            return $http.delete(API+'/empresa/' + id);
        }
    }
})();