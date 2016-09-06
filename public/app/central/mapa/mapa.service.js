(function () {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .service('mapaService', mapaService);

    function mapaService($http, API, authService) {

        this.getUbicacionConductores = function (ruta_id) {
            return $http.get(API + '/conductores/rutas/' + ruta_id + '/ubicacion');
        }

        this.activostotal = function (central_id) {
            return $http.get(API + '/centrales/' + central_id + '/conductores/disponibles');
        }

        this.cantidadenturno = function (ruta_id) {
            return $http.get(API + '/rutas/' + ruta_id + '/conductores/en_turno');
        }

        this.cantidadausente = function (central_id) {
            return $http.get(API + '/centrales/' + central_id + '/conductores/ausentes');
        }

        this.bpasajeros = function (central_id) {
            return $http.get(API + '/centrales/' + central_id + '/conductores/buscandopasajeros');
        }
    }
})();
