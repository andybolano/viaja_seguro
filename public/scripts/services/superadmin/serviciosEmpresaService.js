/**
 * Created by tav0 on 4/01/16.
 */

app.service('serviciosEmpresaService', serviciosEmpresaService);

function serviciosEmpresaService($http) {
    this.getAll = function () {
        return $http.get(uri + '/api/servicios_empresa');
    }

    this.get = function (id) {
        return $http.get(uri + '/api/empresa/' + id);
    }

    this.post = function (object) {
        return $http.post(uri + '/api/servicios_empresa', object);
    }

    this.put = function (object, id) {
        return $http.put(uri + '/api/empresa/' + id, object);
    }

    this.delete = function (id) {
        return $http.delete(uri + '/api/empresa/' + id);
    }
}