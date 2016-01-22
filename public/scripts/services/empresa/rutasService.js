/**
 * Created by tav0 on 4/01/16.
 */

app.service('rutasService', rutasService);

function rutasService($http, authService) {
    var myuri = uri + '/api/empresas/'+authService.currentUser().empresa.id+'/rutas';
    this.getAll = function () {
        return $http.get(myuri);
    }

    this.post = function (object) {
        return $http.post(myuri, object);
    }

    this.delete = function (id) {
        return $http.delete(myuri + '/' + id);
    }
}