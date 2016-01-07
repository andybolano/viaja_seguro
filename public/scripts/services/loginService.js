/**
 * Created by tav0 on 6/01/16.
 */


app.service('loginService', function($http){
    this.login = function (usuario){
        return $http.post(uri + '/api/login', usuario);
    }
});
