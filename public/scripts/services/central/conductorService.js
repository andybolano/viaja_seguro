app.service('conductorService', function ($http , authService) {
    var myuri = uri + '/api/centrales/'+authService.currentUser().central.id+'/conductores';

    this.getAll = function  () {
        return $http.get(myuri);
    }
});