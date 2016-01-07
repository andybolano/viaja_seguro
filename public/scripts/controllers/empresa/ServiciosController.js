app.controller('ServiciosController', function ($scope, serviceEmpresaServicios) {
    $scope.Pasajeros = [];
    $scope.Giros = [];
    $scope.Paquetes = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    $scope.inputDisable = false;

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
        $scope.Pasajero = {};
        $scope.titulo = "Asignar Pasajero"
        $("#modalAsignarPasajero").openModal();
    }

    $scope.buscarClientes = function(){
        $scope.titulo = "Seleccionar cliente como pasajero"
        $("#modalBuscarClientes").openModal();
    }

    $scope.selectCliente = function(cliente){
        $scope.Pasajero.idPasajero = cliente.idCliente;
        $scope.Pasajero.nombres = cliente.nombres;
        $scope.Pasajero.apellidos = cliente.apellidos;
        $scope.Pasajero.origen = cliente.direccion;
        $scope.Pasajero.telefono = cliente.telefono;
        $scope.inputDisable = true;
        $scope.active = 'active';
        $("#modalBuscarClientes").closeModal();
    }

    function cargarGiros() {
        var promiseGet = serviceEmpresaServicios.getGiros();
        promiseGet.then(function (pl) {
            $scope.Giros = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoGiro = function() {
        $scope.editMode = false;
        $scope.Giro = {};
        $scope.titulo = "Asignar Giro"
        $("#modalAsignarGiro").openModal();
    }

    function cargarPaquetes() {
        var promiseGet = serviceEmpresaServicios.getPaquetes();
        promiseGet.then(function (pl) {
            $scope.Paquetes = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoPaquete = function() {
        $scope.editMode = false;
        $scope.Giro = {};
        $scope.titulo = "Asignar Paquete"
        $("#modalAsignarPaquete").openModal();
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