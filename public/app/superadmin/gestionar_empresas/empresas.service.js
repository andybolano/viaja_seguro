/**
 * Created by tav0 on 4/01/16.
 */

(function () {
    'use strict';

    angular
        .module('app.empresas.actividades')
        .service('empresasService', empresasService);

    function empresasService($http, API) {
        this.getAll = function () {
            return $http.get(API + '/empresas');
        }

        this.get = function (id) {
            return $http.get(API + '/empresas/' + id);
        }

        this.post = function (object) {
            return $http.post(API + '/empresas', object);
        }

        this.postLogo = function (id, object) {
            return $http.post(
                API + '/empresas/' + id + '/logo', object,
                {
                    transformRequest: angular.identity, headers: {'Content-Type': undefined}
                }
            );
        }

        this.put = function (object, id) {
            return $http.put(API + '/empresas/' + id, object);
        }

        this.delete = function (id) {
            return $http.delete(API + '/empresas/' + id);
        }
    }
})();