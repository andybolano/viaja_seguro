app.service('VehiculoServicio', function ($http, authService) {
    this.getAll = function(){
        var req = $http.get(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/vehiculos');
        return req;
    }

    this.getFiltering = function (empresa_id, central_id) {
        var myuri = uri + (central_id ? '/api/centrales/'+central_id+'/vehiculos' : '/api/empresas/'+empresa_id+'/vehiculos');
        return $http.get(myuri);
    }

    this.post = function  (object, id) {
        var req = $http.post(uri + '/api/conductores/'+id+'/vehiculo', object)
        return req;
    }

    this.put = function  (object,id) {
        var req = $http.put(uri + '/api/vehiculos/' + id, object)
        return req;
    }

    this.delete = function  (id) {
        var req = $http.delete(uri + '/api/vehiculos/' + id)
        return req;
    }

    this.postImagen = function (id, object) {
        return $http.post(
            uri + '/api/vehiculos/' + id+ '/imagen', object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }

    this.getDocumentacion = function(){
        var req = $http.get(uri+'/api/empresa/documentacion');
        return req;
    }
});