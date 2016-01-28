app.service('VehiculoServicio', function ($http) {
    this.getAll = function(){
        var req = $http.get(uri+'/api/empresa/vehiculos');
        return req;
    }

    this.post = function  (object, id) {
        var req = $http.post(uri + '/api/conductores/'+id+'/vehiculo', object)
        return req;
    }

    this.put = function  (object,id) {
        var req = $http.put(uri + '/api/empresa/vehiculos/' + id, object)
        return req;
    }

    this.delete = function  (id) {
        var req = $http.delete(uri + '/api/empresa/vehiculos/' + id)
        return req;
    }

    this.postImagen = function (id, object) {
        return $http.post(
            uri + '/api/empresas/vehiculo/imagen/' + id, object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }

    this.getDocumentacion = function(){
        var req = $http.get(uri+'/api/empresa/documentacion');
        return req;
    }
});