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

    this.getTurno = function(ruta_id){
        return $http.get(uri + '/api/rutas/'+ruta_id+'/turnos');
    }

    this.eliminarTurno = function(obj){
        return $http.post(uri +'/api/rutas/turnos/conductor', obj);
    }

    this.cargarVehiculoConductor = function(id){
        return $http.get(uri + '/api/conductores/'+id+'/vehiculo');
    }

    this.updateCuposVehiculo = function(id, cupo){
        return $http.put(uri + '/api/vehiculos/'+id,cupo);
    }

    //pasajeros
    this.refrescarPasajeros = function (id) {
        return $http.get(uri+'/api/centrales/'+id+'/pasajeros');
    }

    this.asignarPasajero = function(object){
        return $http.post(uri+'/api/centrales/'+authService.currentUser().central.id+'/pasajeros', object);
    }

    this.modificarPasajero = function(id, object) {
        return $http.put(uri + '/api/pasajeros/' + id, object);
    }

    //giros
    this.refrescarGiros = function (id) {
        return $http.get(uri+'/api/centrales/'+id+'/giros');
    }

    this.asignarGiro = function(object){
        return $http.post(uri+'/api/centrales/'+authService.currentUser().central.id+'/giros', object);
    }

    this.modificarGiro = function(id, object) {
        return $http.put(uri + '/api/giros/' + id, object);
    }

    //paquetes
    this.refrescarPaquetes = function (id) {
        return $http.get(uri+'/api/centrales/'+id+'/paquetes');
    }

    this.asignarPaquete = function(object){
        return $http.post(uri+'/api/centrales/'+authService.currentUser().central.id+'/paquetes', object);
    }

    this.modificarPaquete = function(id, object) {
        return $http.put(uri + '/api/paquetes/' + id, object);
    }
});