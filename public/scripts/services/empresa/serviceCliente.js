app.service('ClienteServicio', function ($http) {

    this.getAll = function  () {
        var req = $http.get(uri + '/api/empresa/clientes');
        return req;
    }

    this.post = function  (object) {
        var req = $http.post(uri + '/api/empresa/clientes', object)
        return req;
    }

    this.put = function  (object,id) {
        var req = $http.put(uri + '/api/empresa/clientes/' + id, object)
        return req;
    }

    this.delete = function  (id) {
        var req = $http.delete(uri + '/api/empresa/clientes/' + id)
        return req;
    }

    this.get = function  (id) {
        var req = $http.get(uri + '/api/empresa/clientes/' + id)
        return req;
    }
});