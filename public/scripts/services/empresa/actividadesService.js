/**
 * Created by tav0 on 4/01/16.
 */

app.service('actividadesService', actividadesService);

function actividadesService($http, authService) {
    this.getAll = function () {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/agenda_actividades');
    }

    this.get = function (id) {
        return $http.get(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/agenda_actividades/' + id);
    }

    this.post = function (object) {
        return $http.post(uri + '/api/empresas/'+authService.currentUser().empresa.id+'/agenda_actividades', object);
    }

    this.put = function (object, id) {
        return $http.put(uri + '/api/agenda_actividades' + '/' + object.id, object);
    }
}