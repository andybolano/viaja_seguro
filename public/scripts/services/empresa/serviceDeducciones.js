app.service('DeduccionesServicio', function ($http) {

    this.getAll = function () {
        var req = $http.get(uri + '/api/empresa/deducciones');
        return req;
    }

    this.updateEstado =  function (id,estado){
        var req = $http.put(uri + '/api/empresa/deducciones/'+id+'/'+estado);
        return req;
    }

    this.post = function(formData){
        var req = $http.post(uri + '/api/empresa/deducciones', formData,{transformRequest: angular.identity,
            headers: {'Content-Type': undefined}});
    }
});