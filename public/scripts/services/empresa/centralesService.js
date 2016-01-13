/**
 * Created by tav0 on 4/01/16.
 */

app.service('centralesService', centralesService);

function centralesService($http) {
    var myuri = uri + '/api/empresas/id/centrales';
    this.getAll = function () {
        return $http.get(myuri);
    }

    this.get = function (id) {
        return $http.get(myuri + '/' + id);
    }

    this.post = function (object) {
        return $http.post(myuri, object);
    }

    this.put = function (object, id) {
        return $http.put(myuri + '/' + id, object);
    }

    this.delete = function (id) {
        return $http.delete(myuri + '/' + id);
    }
}