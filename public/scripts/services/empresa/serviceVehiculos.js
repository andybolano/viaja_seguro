app.service('VehiculoServicio', function ($http) {
    this.getAll = function(){
        var req = $http.get(uri+'/api/empresa/vehiculos');
        return req;
    }
});