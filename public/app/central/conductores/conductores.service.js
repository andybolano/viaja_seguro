(function() {
    'use strict';

    angular
        .module('app.centrales.conductores')
        .service('conductoresService', conductoresService);

    function conductoresService($http, authService){
        var myuri = uri + '/api/centrales/'+authService.currentUser().central.id+'/conductores';

        this.getAll = function  () {
            return $http.get(myuri);
        }
    }
})();
