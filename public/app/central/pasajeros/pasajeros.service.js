/**
 * Created by Jose Soto
 * on 28/05/2016.
 */
(function () {
    'use strict';
    
    angular
        .module('app.centrales.pasajeros')
        .service('pasajerosService', pasajerosService);
    
    function pasajerosService(API, authService, $http) {
        this.getCliente = function (ide) {
            return $http.get(API + '/central/clientes/' + ide);
        }
        //pasajeros
        this.refrescarPasajeros = function () {
            return $http.get(API + '/centrales/' + authService.currentUser().central.id + '/pasajeros');
        }

        this.asignarPasajero = function (object) {
            return $http.post(API + '/centrales/' + authService.currentUser().central.id + '/pasajeros', object);
        }

        this.modificarPasajero = function (id, object) {
            return $http.put(API + '/pasajeros/' + id, object);
        }

        this.eliminarPasajero = function (pasajero_id) {
            return $http.delete(API + '/pasajeros/' + pasajero_id);
        }
    }
})();
