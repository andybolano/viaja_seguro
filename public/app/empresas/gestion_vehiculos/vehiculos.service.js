(function() {
    'use strict';

    angular
        .module('app.empresas.vehiculos')
        .service('vehiculosService', vehiculosService);

    function vehiculosService($http, authService, API){
        this.getAll = function(){
            var req = $http.get(API + '/empresas/'+authService.currentUser().empresa.id+'/vehiculos');
            return req;
        }

        this.getFiltering = function (empresa_id, central_id) {
            var myAPI = API + (central_id ? '/centrales/'+central_id+'/vehiculos' : '/empresas/'+empresa_id+'/vehiculos');
            return $http.get(myAPI);
        }

        this.post = function  (object, id) {
            var req = $http.post(API + '/conductores/'+id+'/vehiculo', object)
            return req;
        }

        this.put = function  (object,id) {
            var req = $http.put(API + '/vehiculos/' + id, object)
            return req;
        }

        this.delete = function  (id) {
            var req = $http.delete(API + '/vehiculos/' + id)
            return req;
        }

        this.postImagen = function (id, object) {
            return $http.post(
                API + '/vehiculos/' + id+ '/imagen', object,
                {transformRequest: angular.identity, headers: {'Content-Type': undefined}
                }
            );
        }

        this.getDocumentacion = function(){
            var req = $http.get(API+'/empresa/documentacion');
            return req;
        }
    }
})();
