app.service('ConductorServicio', function ($http , authService) {
    var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/conductores';

    this.getAll = function  () {
        return $http.get(myuri);
    }

    this.getAllwhitInactivos = function  () {
        return $http.get(myuri+'/all');
    }

    this.post = function  (object) {
        return $http.post(myuri, object)
    }

    this.put = function  (object,id) {
        return $http.put(uri + '/api/conductor/' + id, object)
    }

    this.delete = function  (id) {
        return $http.delete(uri + '/api/conductor/' + id)
    }

    this.get = function  (id) {
        return $http.get(uri+ '/api/conductores/' + id)
    }

    this.postImagen = function (id, object) {
        return $http.post(
            uri + '/api/conductores/'+ id+'/imagen' , object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }
});