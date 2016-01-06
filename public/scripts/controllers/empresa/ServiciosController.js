app.controller('ServiciosController', function ($scope, serviceEmpresaServicios) {
    $scope.Pasajeros = [];
    $scope.Giros = [];
    $scope.Paquetes = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarGiros();
    cargarPaquetes();
    cargarPasajeros();
    cargarVehiculoEnTurno();

    function cargarPasajeros() {
        var promiseGet = serviceEmpresaServicios.getPasajeros();
        promiseGet.then(function (pl) {
            $scope.Pasajeros = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoPasajero = function() {
        $scope.editMode = false;
        $scope.active = "active";
        $scope.Pasajero = {};
        $scope.titulo = "Asignar Pasajero"
        $("#modalAsignarPasajero").openModal();
    }

    function cargarGiros() {
        var promiseGet = serviceEmpresaServicios.getGiros();
        promiseGet.then(function (pl) {
            $scope.Giros = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function cargarPaquetes() {
        var promiseGet = serviceEmpresaServicios.getPaquetes();
        promiseGet.then(function (pl) {
            $scope.Paquetes = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function cargarVehiculoEnTurno(){
        var promiseGet = serviceEmpresaServicios.getVehiculoEnTurno();
        promiseGet.then(function (pl) {
            $scope.Vehiculo = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }
})