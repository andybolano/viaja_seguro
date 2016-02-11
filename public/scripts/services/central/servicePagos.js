app.service('serviceEmpresaPagos', function ($http, authService) {
    this.getPagoPlanilla = function(){
        var req = $http.get(uri+'/api/empresa/pagos/planilla');
        return req;
    }

    this.getPlanilla = function(viaje){
        return $http.get(uri+ '/api/empresa/pagos/planilla/'+viaje);
    }

    this.getDeducciones = function(){
        return $http.get(uri + '/api/empresas/'+ authService.currentUser().central.empresa.id+'/deducciones');
    }
});