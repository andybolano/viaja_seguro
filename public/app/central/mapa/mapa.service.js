(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .service('mapaService', mapaService);

    function mapaService($http){
        this.getUbicacionConductores = function(ruta_id){
            return $http.get(uri + '/api/conductores/rutas/'+ruta_id+'/ubicacion');
        }
    }
})();
