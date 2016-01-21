app.controller('indexController', function($scope, authService) {
    hoy();
    function hoy() {
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
        var f = new Date();
        var hoy = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
        $scope.hoy = hoy;
    }

    $scope.userImagen = authService.currentUser().imagen;
    $scope.nameEmpresa = authService.currentUser().empresa.nombre;
    $scope.userRol = authService.currentUser().rol;
    $scope.cerrarSesion = function(){
        sessionStorage.clear();
        window.location.href = '../../public/login.html';
    }

});


