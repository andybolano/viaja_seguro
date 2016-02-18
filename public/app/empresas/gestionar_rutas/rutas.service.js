(function () {
    'use strict';

    angular
        .module('app.empresas.rutas')
        .service('rutasService', rutasService);

    function rutasService($http, authService, API) {
        this.getAll = function () {
            return $http.get(API+'/empresas/' + authService.currentUser().empresa.id + '/rutas');
        }

        this.post = function (object) {
            return $http.post(API+'/empresas/' + authService.currentUser().empresa.id + '/rutas', object);
        }

        this.delete = function (id) {
            return $http.delete(API+'/rutas/' + id);
        }
    }
})();