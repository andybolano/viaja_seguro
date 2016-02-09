app.service('ubicacionesService', function ($http ) {

    this.getUbicacionConductores = function(ruta_id){
        return $http.get(uri + '/api/conductores/rutas/'+ruta_id+'/ubicacion');
    }

});