app.service('serviceEmpresaServicios', function ($http) {

    this.getVehiculoEnTurno = function(){
        var req = $http.get(uri + '/api/empresa/vehiculo/getVehiculoEnTurno');
        return req;
    }

    this.getCliente = function(id){
        var req = $http.get(uri + '/api/central/clientes/' + id);
        return req;
    }
});