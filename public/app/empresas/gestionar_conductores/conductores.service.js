(function () {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .service('conductoresEmpresaService', conductoresService);

    function conductoresService($http, authService, API) {

        this.conductor = {};

        this.getAll = function () {
            return $http.get(API + '/empresas/' + authService.currentUser().empresa.id + '/conductores/all');
        };

        this.getVehiculoConductor = function (id) {
            return $http.get(API + '/conductores/' + id + '/vehiculo');
        };

        this.post = function (object) {
            return $http.post(API + '/empresas/' + authService.currentUser().empresa.id + '/conductores', object);
        };

        this.postImagen = function (id, object) {
            return $http.post(
                API + '/conductores/' + id + '/imagen', object,
                {transformRequest: angular.identity, headers: {'Content-Type': undefined}}
            );
        };

        this.postImagenVehiculo = function (id, object) {
            return $http.post(
                API + '/vehiculos/' + id + '/imagen', object,
                {transformRequest: angular.identity, headers: {'Content-Type': undefined}}
            );
        };

        this.put = function (object, id) {
            return $http.put(API + '/conductor/' + id, object);
        }

        this.delete = function (id) {
            return $http.delete(API + '/conductor/' + id);
        }
    }
})();
