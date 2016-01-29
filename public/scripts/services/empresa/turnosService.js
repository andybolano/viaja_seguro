app.service('turnosService', function ($http , authService) {
    this.getAllConductores = function  () {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().central.empresa.id+'/conductores');
    }
});