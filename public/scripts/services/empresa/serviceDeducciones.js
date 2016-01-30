app.service('DeduccionesServicio', function ($http, authService) {
    if(authService.currentUser().empresa.id){
        var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/deducciones';
    }else if(authService.currentUser().central.empresa.id){
        var myuri = uri + '/api/empresas/'+authService.currentUser().central.empresa.id+'/deducciones';
    }else{
        console.log('Error al intentar consultar la uri deducciones...')
    }

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