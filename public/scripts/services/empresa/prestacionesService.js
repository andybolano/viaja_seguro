/**
 * Created by tav0 on 4/01/16.
 */

app.service('prestacionesService', prestacionesService);

function prestacionesService($http, authService) {
    this.getAll = function () {
        return $http.get(uri+'/api/prestaciones');
    }

    this.getPagos = function (prestacion_id) {
        return $http.get(uri+'/api/empresas/'+authService.currentUser().empresa.id+'/pagos_prestaciones/'+prestacion_id);
    }

    this.post = function (object) {
        return $http.post(uri+'/api/conductores/'+object.conductor_id+'/pagos_prestaciones', object);
    }
}