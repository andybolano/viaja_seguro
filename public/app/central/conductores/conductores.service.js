(function() {
    'use strict';

    angular
        .module('app.centrales.conductores')
        .service('conductoresService', conductoresService);

    function conductoresService($http, authService, API){
        var myuri = API + '/centrales/'+authService.currentUser().central.id+'/conductores';

        this.getAll = function  () {
            return $http.get(myuri);
        }
        this.get = function  (id) {
            return $http.get(API+'/conductores/'+id);
        }
    }
})();
