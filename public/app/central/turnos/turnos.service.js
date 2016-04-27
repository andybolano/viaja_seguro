(function() {
    'use strict';

    angular
        .module('app.centrales.turnos')
        .service('turnosService', turnosService);

    function turnosService($http, authService, API){
        this.getConductoresEnRuta = function(ruta_id){
            return $http.get(API+'/empresas/'+authService.currentUser().central.empresa.id+ '/conductores/disponibles');
        }

        this.getRutasCentral = function () {
            return $http.get(API + '/centrales/'+authService.currentUser().central.id+'/rutas');
        }

        this.updateTurnos = function (ruta_id, turnos) {
            return $http.put(API + '/rutas/'+ruta_id+'/turnos', turnos);
        }

        this.getTurno = function(ruta_id){
            return $http.get(API + '/rutas/'+ruta_id+'/turno/primero');
        }

        this.getCupos = function(conductor_id){
            return $http.get(API + '/conductores/'+conductor_id+'/cupos');
        }

        this.eliminarTurno = function(obj){
            return $http.post(API +'/rutas/turnos/conductor', obj);
        }

        this.cargarVehiculoConductor = function(id){
            return $http.get(API + '/conductores/'+id+'/vehiculo');
        }

        //cliente
        this.getCliente = function(ide){
            return $http.get(API + '/central/clientes/'+ide);
        }
        //pasajeros
        this.refrescarPasajeros = function (id) {
            return $http.get(API+'/centrales/'+id+'/pasajeros');
        }

        this.asignarPasajero = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/pasajeros', object);
        }

        this.modificarPasajero = function(id, object) {
            return $http.put(API + '/pasajeros/' + id, object);
        }

        this.eliminarPasajero = function(pasajero_id){
            return $http.delete(API + '/pasajeros/'+ pasajero_id);
        }

        //giros
        this.refrescarGiros = function (id) {
            return $http.get(API+'/centrales/'+id+'/giros');
        }

        this.asignarGiro = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/giros', object);
        }

        this.modificarGiro = function(id, object) {
            return $http.put(API + '/giros/' + id, object);
        }

        this.eliminarGiro = function(giro_id){
            return $http.delete(API + '/giros/'+ giro_id);
        }

        //paquetes
        this.refrescarPaquetes = function (id) {
            return $http.get(API+'/centrales/'+id+'/paquetes');
        }

        this.asignarPaquete = function(object){
            return $http.post(API+'/centrales/'+authService.currentUser().central.id+'/paquetes', object);
        }

        this.modificarPaquete = function(id, object) {
            return $http.put(API + '/paquetes/' + id, object);
        }

        this.eliminarPaquete = function(paquete_id){
            return $http.delete(API + '/paquetes/'+ paquete_id);
        }

        this.getSolicitudesPasajeros = function(){
            return $http.get(API + '/centrales/'+authService.currentUser().central.id+'/solicitudes_pasajeros');
        }

        this.getSolicitudPasajero = function(solicitud_id){
            return $http.get(API + '/centrales/solicitudes_pasajeros/'+ solicitud_id);
        }

        this.getSolicitudPaquete = function(solicitud_id){
            return $http.get(API + '/centrales/solicitudes_paquetes/'+ solicitud_id);
        }

        this.getSolicitudGiro = function(solicitud_id){
            return $http.get(API + '/centrales/solicitudes_giros/'+ solicitud_id);
        }

        this.rechazarSolicitud = function(obj, solicitud_id){
            return $http.put(API + '/centrales/solicitudes/'+solicitud_id+'/rechazo', obj);
        }

        this.asignarSolicitud = function(solicitud_id, obj){
            return $http.put(API + '/centrales/solicitudes/'+solicitud_id+'/aceptar', obj);
        }

        this.cargarTurnosC = function(){
            return $http.get(API + '/centrales/'+authService.currentUser().central.id+'/rutas/conductorEnTurno');
        }

        this.moverGiro = function(giro_id, obj){
            return $http.put(API + '/centrales/giros/'+giro_id+'/mover',obj);
        }

        this.moverPaquete = function(paquete_id, obj){
            return $http.put(API + '/centrales/paquetes/'+paquete_id+'/mover',obj);
        }
    }
})();
