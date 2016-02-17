(function () {
    'use strict';

    angular
        .module('app.empresas')
        .service('centralesService', centralesService);

    function centralesService($http, authService, API) {
        this.getAll = function (empresa_id) {
            empresa_id || ( empresa_id = authService.currentUser().empresa.id );
            return $http.get(API + '/empresas/' + empresa_id + '/centrales');
        }

        this.get = function (id) {
            return $http.get(API + '/empresas/' + authService.currentUser().empresa.id + '/centrales/' + id);
        }

        this.post = function (object) {
            return $http.post(API + '/empresas/' + authService.currentUser().empresa.id + '/centrales', object);
        }

        this.put = function (object, id) {
            return $http.put(API + '/centrales' + '/' + id, object);
        }

        this.delete = function (id) {
            return $http.delete(API + '/centrales' + '/' + id);
        }

        this.getCiudades = function () {
            return $http.get(API + '/ciudades');
        }
    }
})();
