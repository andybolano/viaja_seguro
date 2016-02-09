/**
 * Created by tav0 on 4/01/16.
 */

app.service('centralesService', centralesService);

function centralesService($http, authService) {
    this.getAll = function (empresa_id) {
        empresa_id || ( empresa_id = authService.currentUser().empresa.id );
        return $http.get(uri + '/api/empresas/'+empresa_id+'/centrales');
    }

    this.get = function (id) {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/centrales/' + id);
    }

    this.post = function (object) {
        return $http.post(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/centrales', object);
    }

    this.put = function (object, id) {
        return $http.put(uri + '/api/centrales' + '/' + id, object);
    }

    this.delete = function (id) {
        return $http.delete(uri + '/api/centrales' + '/' + id);
    }
}