(function () {
    'use strict';

    angular
        .module('app.empresas.deducciones')
        .service('deduccionesService', deduccionesService);

    function deduccionesService($http, authService, API) {
        var myAPI = API + '/empresas/' + authService.currentUser().empresa.id + '/deducciones';

        this.getAll = function () {
            return $http.get(myAPI);
        }

        this.post = function (object) {
            return $http.post(myAPI, object);
        }

        this.updateEstado = function (id, estado) {
            return $http.put(API + '/deducciones/' + id + '/estado/' + estado);
        }

        this.put = function ($object, $id) {
            return $http.put(API + "/deducciones/" + $id, $object);
        }


        this.delete = function (id) {
            var req = $http.delete(API + '/deducciones/' + id)
            return req;
        }
    }
})();
