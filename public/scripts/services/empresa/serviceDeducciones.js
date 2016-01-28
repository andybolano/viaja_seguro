app.service('DeduccionesServicio', function ($http, authService) {
    var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/deducciones';


    this.getAll = function () {
        return $http.get(myuri);
    }

    this.post = function(object){
        return $http.post(myuri, object);
    }

    this.updateEstado =  function (id,estado){
        return $http.put(uri + '/api/deducciones/'+id+'/estado/'+estado);
    }

    this.put = function($object, $id){
        return $http.put(uri + "/api/deducciones/" + $id, $object);
    }


    this.delete = function  (id) {
        var req = $http.delete(uri + '/api/deducciones/' + id)
        return req;
    }
});