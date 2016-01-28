app.service('pasajerosService', function ($http, authService) {

    var myuri = uri + '/api/centrales/'+authService.currentUser().central.id+'/pasajeros';

    this.getAll = function(){
        var req = $http.get(myuri);
        return req;
    }

    this.post = function(object){
        var req = $http.post(myuri, object);
        return req;
    }

    this.put = function(object,id){
        var req = $http.put(uri+'/api/pasajeros/'+ id, object);
        return req;
    }

    this.delete = function(id){
        var req = $http.delete(uri+'/api/pasajeros/'+ id);
        return req;
    }

    this.get = function(id){
        var req = $http.get(uri+'/api/pasajeros/'+ id);
        return req;
    }
});