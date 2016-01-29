app.service('VehiculoServicio', function ($http, authService) {
    var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/vehiculos';
    this.getAll = function(){
        var req = $http.get(myuri);
        return req;
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