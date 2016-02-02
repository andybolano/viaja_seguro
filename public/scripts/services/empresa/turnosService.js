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

    this.cargarVehiculoConductor = function(id){
        return $http.get(uri + '/api/conductores/'+id+'/vehiculo');
    }

    this.updateCuposVehiculo = function(id, cupo){
        return $http.put(uri + '/api/vehiculos/'+id,cupo);
    }

    this.refrescarPasajeros = function (id) {
        return $http.get(uri+'/api/centrales/'+id+'/pasajeros');
    }

    this.asignarPasajero = function(object){
        return $http.post(uri+'/api/centrales/'+authService.currentUser().central.id+'/pasajeros', object);
    }

    this.modificarPasajero = function(id, object){
        return $http.put(uri+'/api/pasajeros/'+id, object);
    }

});