app.service('DeduccionesServicio', function ($http) {

    this.getAll = function () {
        var req = $http.get(uri + '/api/empresa/deducciones');
        return req;
    }
});