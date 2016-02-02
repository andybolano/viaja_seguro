app.service('turnosService', function ($http , authService) {
    this.getAllConductores = function  () {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().central.empresa.id+'/conductores');
    }

    this.getRutasCentral = function () {
        return $http.get(uri + '/api/centrales/'+authService.currentUser().central.id+'/rutas');
    }

    this.updateTurnos = function (ruta_id, turnos) {
        return $http.put(uri + '/api/rutas/'+ruta_id+'/turnos', turnos);
    }

});