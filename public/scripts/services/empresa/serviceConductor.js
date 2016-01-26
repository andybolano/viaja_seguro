app.service('ConductorServicio', function ($http , authService) {
    var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/conductores';

    this.getAll = function  () {
        return $http.get(myuri);
    }

    this.post = function  (object) {
        return $http.post(myuri, object)
    }

    this.put = function  (object,id) {
        return $http.put(myuri + '/' + id, object)
    }

    this.delete = function  (id) {
        return $http.delete(myuri + '/' + id)
    }

    this.get = function  (id) {
        return $http.get(myuri + '/' + id)
    }

    this.postImagen = function (id, object) {
        return $http.post(
            uri + '/api/empresas/conducdor/imagen/' + id, object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }
});