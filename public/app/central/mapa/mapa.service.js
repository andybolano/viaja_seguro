(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .service('mapaService', mapaService);

    function mapaService($http, API, $websocket, $firebaseObject){
        this.getUbicacionConductores = function(ruta_id){
            return $http.get(API + '/conductores/rutas/'+ruta_id+'/ubicacion');
        }

        this.getUbicacion = function(ruta_id){
            var ref = new Firebase("https://sokectubi.firebaseio.com");
            var sync = $firebaseObject(ref);
            return sync;
        }
    }
})();
