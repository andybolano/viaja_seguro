(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .service('mapaService', mapaService);

    function mapaService($http, API){
        this.getUbicacionConductores = function(ruta_id){
            return $http.get(API + '/conductores/rutas/'+ruta_id+'/ubicacion');
        }

        this.activostotal = function(){
            return $http.get(API + '/conductores/disponibles');
        }

        this.cantidadenturno= function () {
            return $http.get(API + '/conductores/turnos/cantidad');
        }

        this.cantidadausente = function () {
            return $http.get(API + '/conductores/ausentes');
        }
    }
})();
