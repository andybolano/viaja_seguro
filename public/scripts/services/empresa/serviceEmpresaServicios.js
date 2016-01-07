app.service('serviceEmpresaServicios', function ($http) {
    this.getPasajeros = function(){
        var req = $http.get(uri+'/api/empresa/obtener/pasajeros');
        return req;
    }

    this.getGiros = function(){
        var req = $http.get(uri+'/api/empresa/obtener/giros');
        return req;
    }

    this.getPaquetes = function(){
        var req = $http.get(uri+'/api/empresa/obtener/paquetes');
        return req;
    }

    this.getVehiculoEnTurno = function(){
        var req = $http.get(uri + '/api/empresa/vehiculo/getVehiculoEnTurno');
        return req;
    }
});