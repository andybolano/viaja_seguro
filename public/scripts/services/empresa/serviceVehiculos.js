app.service('VehiculoServicio', function ($http) {
    this.getAll = function(){
        var req = $http.get(uri+'/api/empresa/vehiculos');
        return req;
    }

    this.post = function  (object) {
        var req = $http.post(uri + '/api/empresa/vehiculos', object)
        return req;
    }
});