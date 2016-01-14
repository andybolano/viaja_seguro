app.service('serviceEmpresaServicios', function ($http) {
    this.getPasajeros = function(){
        var req = $http.get(uri+'/api/empresa/obtener/pasajeros');
        return req;
    }

    this.postPasajero = function(object){
        var req = $http.post(uri+'/api/empresa/pasajeros', object);
        return req;
    }

    this.putPasajero = function(object,id){
        var req = $http.put(uri+'/api/empresa/pasajeros'+ id, object);
        return req;
    }

    this.deletePasajero = function(id){
        var req = $http.delete(uri+'/api/empresa/pasajeros'+ id);
        return req;
    }

    this.getPasajero = function(id){
        var req = $http.get(uri+'/api/empresa/pasajeros'+ id);
        return req;
    }

    this.getGiros = function(){
        var req = $http.get(uri+'/api/empresa/obtener/giros');
        return req;
    }

    this.postGiro = function(object){
        var req = $http.post(uri+'/api/empresa/giros', object);
        return req;
    }

    this.putGiro = function(object,id){
        var req = $http.put(uri+'/api/empresa/giros'+ id, object);
        return req;
    }

    this.deleteGiro = function(id){
        var req = $http.delete(uri+'/api/empresa/giros'+ id);
        return req;
    }

    this.getGiro = function(id){
        var req = $http.get(uri+'/api/empresa/giros'+ id);
        return req;
    }

    this.getPaquetes = function(){
        var req = $http.get(uri+'/api/empresa/obtener/paquetes');
        return req;
    }

    this.postPaquete = function(object){
        var req = $http.post(uri+'/api/empresa/paquetes', object);
        return req;
    }

    this.putPaquete = function(object,id){
        var req = $http.put(uri+'/api/empresa/paquetes'+ id, object);
        return req;
    }

    this.deletePaquete = function(id){
        var req = $http.delete(uri+'/api/empresa/paquetes'+ id);
        return req;
    }

    this.getPaquete = function(id){
        var req = $http.get(uri+'/api/empresa/paquetes'+ id);
        return req;
    }

    this.getVehiculoEnTurno = function(){
        var req = $http.get(uri + '/api/empresa/vehiculo/getVehiculoEnTurno');
        return req;
    }
});