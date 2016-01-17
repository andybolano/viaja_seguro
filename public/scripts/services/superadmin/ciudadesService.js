/**
 * Created by tav0 on 15/01/16.
 */

app.service('ciudadesService', ciudadesService);

function ciudadesService($http) {
    this.getAll = function () {
        return $http.get(uri + '/api/ciudades');
    }

    this.get = function (id) {
        return $http.get(uri + '/api/ciudades/' + id);
    }

    this.post = function (object) {
        return $http.post(uri + '/api/ciudades', object);
    }

    this.put = function (object, id) {
        return $http.put(uri + '/api/ciudades/' + id, object);
    }

    this.delete = function (id) {
        return $http.delete(uri + '/api/ciudades/' + id);
    }
}