app.service('ConductorServicio', function ($http) {
    this.getAll = function(){
        var req = $http.get(uri+'/api/conductores');
        return req;
    }
});