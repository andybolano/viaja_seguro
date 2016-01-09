app.service('serviceEmpresaPagos', function ($http) {
    this.getPagoPlanilla = function(){
        var req = $http.get(uri+'/api/empresa/pagos/planilla');
        return req;
    }

    this.getPagoAhorros = function(){
        var req = $http.get(uri+'/api/empresa/pagos/ahorro');
        return req;
    }

    this.getPagoSeguridad = function(){
        var req = $http.get(uri+'/api/empresa/pagos/seguridad');
        return req;
    }

    this.getPagoPension = function(){
        var req = $http.get(uri + '/api/empresa/pagos/pension');
        return req;
    }
});