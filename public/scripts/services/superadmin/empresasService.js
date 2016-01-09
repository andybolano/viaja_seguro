/**
 * Created by tav0 on 4/01/16.
 */

app.service('empresasService', empresasService);

function empresasService($http) {
    this.getAll = function () {
        return $http.get(uri + '/api/empresas');
    }

    this.get = function (id) {
        return $http.get(uri + '/api/empresa/' + id);
    }

    this.post = function (object) {
        return $http.post(uri + '/api/empresas', object);
    }

    this.postLogo = function (id, object) {
        return $http.post(
            uri + '/api/empresas/' + id + '/logo', object,
            {transformRequest: angular.identity, headers: {'Content-Type': undefined}
            }
        );
    }

    this.put = function (object, id) {
        return $http.put(uri + '/api/empresa/' + id, object);
    }

    this.delete = function (id) {
        return $http.delete(uri + '/api/empresa/' + id);
    }
}