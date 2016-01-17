app.service('ConductorServicio', function ($http) {

    this.getAll = function  () {
        var req = $http.get(uri + '/api/empresa/conductores');
        return req;
    }

    this.post = function  (object) {
        var req = $http.post(uri + '/api/empresa/conductores', object)
        return req;
    }

    this.put = function  (object,id) {
        var req = $http.put(uri + '/api/empresa/conductores/' + id, object)
        return req;
    }

    this.delete = function  (id) {
        var req = $http.delete(uri + '/api/empresa/conductores/' + id)
        return req;
    }

    this.get = function  (id) {
        var req = $http.get(uri + '/api/empresa/conductores/' + id)
        return req;
    }

    this.postImagen = function (id, object) {
        return $http.post(
            uri + '/api/empresas/conducdor/imagen/' + id, object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }
});