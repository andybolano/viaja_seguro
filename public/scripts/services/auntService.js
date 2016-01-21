/**
 * Created by tav0 on 6/01/16.
 */


app.service('authService', function($http, $location, jwtHelper){
    this.login = function (usuario){
        return $http.post('../public/api/login', usuario);
    };

    this.storeUser = function (jwt) {
        sessionStorage.setItem('jwt', jwt);
        var usuario = jwtHelper.decodeToken(jwt).usuario;
        sessionStorage.setItem('usuario',JSON.stringify(usuario));
        return usuario;
    }

    this.checkAuthentication = function (owner){
        var usuario = JSON.parse(sessionStorage.getItem('usuario'));
        var jwt = sessionStorage.getItem('jwt');
        if(!jwt || jwtHelper.isTokenExpired(jwt) || !usuario || usuario.rol != owner){
            window.location.href = '../../public/login.html';
        }
        if(($location.path() === '/login') && usuario.rol == owner){
            $location.path('/home');
        }
    }
});
