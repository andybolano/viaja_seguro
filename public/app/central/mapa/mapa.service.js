(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .service('mapaService', mapaService);

    function mapaService($http, API){
        this.getUbicacionConductores = function(ruta_id){
            return $http.get(API + '/conductores/rutas/'+ruta_id+'/ubicacion');
        }
    }
})();
