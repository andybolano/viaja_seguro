app.service('ConductorServicio', function ($http) {
    this.getAll = function(){
        var req = $http.get(uri+'/api/empresa/conductores');
        return req;
    }
});