/**
 * Created by tav0 on 4/01/16.
 */

app.service('rutasService', rutasService);

function rutasService($http, authService) {
    this.getAll = function () {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/rutas');
    }

    this.post = function (object) {
        return $http.post(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/rutas', object);
    }

    this.delete = function (id) {
        return $http.delete(uri + '/api/rutas/' + id);
    }
}