/**
 * Created by tav0 on 6/01/16.
 */

app.controller('loginController', function($scope, loginService) {

    $scope.usuario = {};
    $scope.mensajeError = '';

    $scope.iniciarSesion = function(){
        loginService.login().then(success, error);
        function success(p) {
            Materialize.toast("Usuario auntenticado",4000);
            sessionStorage.setItem("usuario",JSON.stringify(p.data));

            window.location.href = "view/index.html";
        }
        function error(error) {
            console.log('Error en Login', error);
            $scope.mensajeError = error.status == 401 ? p.data.mensajeError : 'A ocurrido un erro inesperado';
        }
    }

});