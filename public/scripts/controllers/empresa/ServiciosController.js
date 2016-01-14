app.controller('ServiciosController', function ($scope, serviceEmpresaServicios) {
    $scope.Pasajeros = [];
    $scope.Giros = [];
    $scope.Paquetes = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    $scope.inputDisable = false;
    init();
    cargarGiros();
    cargarPaquetes();
    cargarPasajeros();
    cargarVehiculoEnTurno();

    function init(){
        $scope.Pasajero = {
            identificacion : "",
            nombres : "",
            apellidos : "",
            telefono : "",
            origen : "",
            destino : "",
            vehiculo : ""
        }
    }

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

    $scope.modificarPasajero = function(){

    }

    $scope.buscarClientes = function(){
        $scope.titulo = "Seleccionar cliente"
        $("#modalBuscarClientes").openModal();
    }

    $scope.selectCliente = function(cliente){
        $scope.Giro = cliente;
        $scope.Pasajero.identificacion = cliente.identificacion;
        $scope.Pasajero.nombres = cliente.nombres;
        $scope.Pasajero.apellidos = cliente.apellidos;
        $scope.Pasajero.origen = cliente.direccion;
        $scope.Pasajero.telefono = cliente.telefono;
        $scope.inputDisable = true;
        $scope.active = 'active';
        $("#modalBuscarClientes").closeModal();
    }

    $scope.guardarPasajero = function(){
        var object = {
            identificacion : $scope.Pasajero.identificacion,
            nombres : $scope.Pasajero.nombres,
            apellidos : $scope.Pasajero.apellidos,
            telefono : $scope.Pasajero.telefono,
            origen : $scope.Pasajero.origen,
            destino : $scope.Pasajero.destino,
            vehiculo : $scope.Vehiculo
        };
        console.log(object);
        var promisePost = serviceEmpresaServicios.postPasajero(object);
        promisePost.then(function (pl) {
                $("#modalAsignarPasajero").closeModal();
                cargarPasajeros();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.updatePasajero = function(){
        var object = {
            identificacion : $scope.Pasajero.identificacion,
            nombres : $scope.Pasajero.nombres,
            apellidos : $scope.Pasajero.apellidos,
            telefono : $scope.Pasajero.telefono,
            origen : $scope.Pasajero.origen,
            destino : $scope.Pasajero.destino,
            vehiculo : $scope.Vehiculo
        };
        console.log(object);
        var promisePut = serviceEmpresaServicios.putPasajero(object, $scope.Pasajero.identificacion);
        promisePut.then(function (pl) {
                $("#modalAsignarPasajero").closeModal();
                cargarPasajeros();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.deletePasajero = function(id){
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = serviceEmpresaServicios.deletePasajero(id);
            promiseDelete.then(function (pl) {
                    cargarPasajeros();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }



    $scope.selectClienteGiro = function(cliente){
        $scope.Giro.idRemitente = cliente.identificacion;
        $scope.Giro.nombresRemitente = cliente.nombres + " " + cliente.apellidos;
        $scope.Giro.telRemitente = cliente.telefono;
        $scope.Giro.origen = cliente.direccion;
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

    $scope.guardarGiro = function(){
        var object = {
            identificacion : $scope.Pasajero.identificacion,
            nombres : $scope.Pasajero.nombres,
            apellidos : $scope.Pasajero.apellidos,
            telefono : $scope.Pasajero.telefono,
            origen : $scope.Pasajero.origen,
            destino : $scope.Pasajero.destino,
            vehiculo : $scope.Vehiculo
        };
        console.log(object);
        var promisePost = serviceEmpresaServicios.postGiro(object);
        promisePost.then(function (pl) {
                $("#modalAsignarGiro").closeModal();
                cargarPasajeros();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.updateGiro = function(){
        var object = {
            identificacion : $scope.Pasajero.identificacion,
            nombres : $scope.Pasajero.nombres,
            apellidos : $scope.Pasajero.apellidos,
            telefono : $scope.Pasajero.telefono,
            origen : $scope.Pasajero.origen,
            destino : $scope.Pasajero.destino,
            vehiculo : $scope.Vehiculo
        };
        console.log(object);
        var promisePut = serviceEmpresaServicios.putGiro(object, $scope.Pasajero.identificacion);
        promisePut.then(function (pl) {
                $("#modalAsignarGiro").closeModal();
                cargarGiros();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.deleteGiro = function(id){
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = serviceEmpresaServicios.deleteGiro(id);
            promiseDelete.then(function (pl) {
                    cargarGiros();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
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