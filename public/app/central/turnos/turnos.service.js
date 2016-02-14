(function() {
    'use strict';

    angular
        .module('app.centrales.turnos')
        .service('turnosService', turnosService);

    function turnosService($http, authService, API){
        this.getAllConductores = function  () {
            return $http.get(API + '/api/empresas/'+authService.currentUser().central.empresa.id+'/conductores');
        }

        this.getRutasCentral = function () {
            return $http.get(API + '/api/centrales/'+authService.currentUser().central.id+'/rutas');
        }

        this.updateTurnos = function (ruta_id, turnos) {
            return $http.put(API + '/api/rutas/'+ruta_id+'/turnos', turnos);
        }

        this.getTurno = function(ruta_id){
            return $http.get(API + '/api/rutas/'+ruta_id+'/turnos');
        }

        this.eliminarTurno = function(obj){
            return $http.post(API +'/api/rutas/turnos/conductor', obj);
        }

        this.cargarVehiculoConductor = function(id){
            return $http.get(API + '/api/conductores/'+id+'/vehiculo');
        }

        this.updateCuposVehiculo = function(id, cupo){
            return $http.put(API + '/api/vehiculos/'+id,cupo);
        }

        //pasajeros
        this.refrescarPasajeros = function (id) {
            return $http.get(API+'/api/centrales/'+id+'/pasajeros');
        }

        this.asignarPasajero = function(object){
            return $http.post(API+'/api/centrales/'+authService.currentUser().central.id+'/pasajeros', object);
        }

        this.modificarPasajero = function(id, object) {
            return $http.put(API + '/api/pasajeros/' + id, object);
        }

        this.eliminarPasajero = function(pasajero_id){
            return $http.delete(API + '/api/pasajeros/'+ pasajero_id);
        }

        //giros
        this.refrescarGiros = function (id) {
            return $http.get(API+'/api/centrales/'+id+'/giros');
        }

        this.asignarGiro = function(object){
            return $http.post(API+'/api/centrales/'+authService.currentUser().central.id+'/giros', object);
        }

        this.modificarGiro = function(id, object) {
            return $http.put(API + '/api/giros/' + id, object);
        }

        this.eliminarGiro = function(giro_id){
            return $http.delete(API + '/api/giros/'+ giro_id);
        }

        //paquetes
        this.refrescarPaquetes = function (id) {
            return $http.get(API+'/api/centrales/'+id+'/paquetes');
        }

        this.asignarPaquete = function(object){
            return $http.post(API+'/api/centrales/'+authService.currentUser().central.id+'/paquetes', object);
        }

        this.modificarPaquete = function(id, object) {
            return $http.put(API + '/api/paquetes/' + id, object);
        }

        this.eliminarPaquete = function(paquete_id){
            return $http.delete(API + '/api/paquetes/'+ paquete_id);
        }
    }
})();
