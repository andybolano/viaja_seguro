app.controller('ServiciosController', function ($scope, serviceEmpresaServicios, ciudadesService) {
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
        loadCiudades();
        $scope.Pasajero = {}
        $scope.Giro = {}
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

    $scope.modificarPasajero = function(pasajero){
        $scope.active = "active";
        $scope.editMode = true;
        $scope.Pasajero = pasajero;
        $scope.titulo = "Modificar pasajero"
        $("#modalAsignarPasajero").openModal();
    }



    $scope.selectCliente = function(){
        var ide_cliente = $scope.Pasajero.identificacion;
        var promiseGet = serviceEmpresaServicios.getCliente(ide_cliente);
        promiseGet.then(function(pl){
            $scope.active = "active";
            $scope.Pasajero = pl.data;
            $scope.Pasajero.direccionO = pl.data.direccion;
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.guardarPasajero = function(){
        var object = {
            identificacion : $scope.Pasajero.identificacion,
            nombres : $scope.Pasajero.nombres,
            apellidos : $scope.Pasajero.apellidos,
            telefono : $scope.Pasajero.telefono,
            origen : $scope.Pasajero.origen.nombre,
            direccionO : $scope.Pasajero.direccionO,
            destino : $scope.Pasajero.destino.nombre,
            direccionD: $scope.Pasajero.direccionD,
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
            origen : $scope.Pasajero.origen.nombre,
            direccionO : $scope.Pasajero.direccionO,
            destino : $scope.Pasajero.destino.nombre,
            direccionD: $scope.Pasajero.direccionD,
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

    function cargarGiros() {
        var promiseGet = serviceEmpresaServicios.getGiros();
        promiseGet.then(function (pl) {
            $scope.Giros = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.selectClienteGiro = function(){
        var ide_remitente = $scope.Giro.ide_remitente;
        var promiseGet = serviceEmpresaServicios.getCliente(ide_remitente);
        promiseGet.then(function(pl){
                $scope.active = "active";
                $scope.Giro.ide_remitente = pl.data.identificacion;
                $scope.Giro.nombres_remitente = pl.data.nombres + " " + pl.data.apellidos;
                $scope.Giro.tel_remitente = pl.data.telefono;
                $scope.Giro.direccionO = pl.data.direccion;
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.nuevoGiro = function() {
        $scope.editMode = false;
        $scope.Giro = {};
        $scope.titulo = "Asignar Giro"
        $("#modalAsignarGiro").openModal();
    }

    $scope.modificarGiro = function(giro) {
        $scope.editMode = true;
        $scope.active = "active";
        $scope.Giro = giro;
        $scope.titulo = "Modificar Giro";
        $("#modalAsignarGiro").openModal();
    }

    $scope.guardarGiro = function(){
        var object = {
            ide_remitente : $scope.Giro.ide_remitente,
            nombres_remitente : $scope.Giro.nombres_remitente,
            tel_remitente : $scope.Giro.tel_remitente,
            ide_receptor : $scope.Giro.ide_receptor,
            nombres_receptor : $scope.Giro.nombres_receptor,
            tel_receptor : $scope.Giro.tel_receptor,
            origen : $scope.Giro.origen.nombre,
            direccionO : $scope.Giro.direccionO,
            destino : $scope.Giro.destino.nombre,
            direccionD : $scope.Giro.direccionD,
            vehiculo : $scope.Vehiculo,
            cantidad : $scope.Giro.cantidad
        };
        console.log(object);
        var promisePost = serviceEmpresaServicios.postGiro(object);
        promisePost.then(function (pl) {
                $("#modalAsignarGiro").closeModal();
                cargarGiros();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.updateGiro = function(){
        var object = {
            ide_remitente : $scope.Giro.ide_remitente,
            nombres_remitente : $scope.Giro.nombres_remitente,
            tel_remitente : $scope.Giro.tel_remitente,
            ide_receptor : $scope.Giro.ide_receptor,
            nombres_receptor : $scope.Giro.nombres_receptor,
            tel_receptor : $scope.Giro.tel_receptor,
            origen : $scope.Giro.origen.nombre,
            direccionO : $scope.Giro.direccionO,
            destino : $scope.Giro.destino.nombre,
            direccionD : $scope.Giro.direccionD,
            vehiculo : $scope.Vehiculo,
            cantidad : $scope.Giro.cantidad
        };
        console.log(object);
        var promisePut = serviceEmpresaServicios.putGiro(object, $scope.Giro.id);
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

    $scope.selectClientePaquete = function(){
        var ide_remitente = $scope.Paquete.ide_remitente;
        var promiseGet = serviceEmpresaServicios.getCliente(ide_remitente);
        promiseGet.then(function(pl){
                $scope.active = "active";
                $scope.Paquete.ide_remitente = pl.data.identificacion;
                $scope.Paquete.nombres_remitente = pl.data.nombres + " " + pl.data.apellidos;
                $scope.Paquete.tel_remitente = pl.data.telefono;
                $scope.Paquete.direccionO = pl.data.direccion;
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.nuevoPaquete = function() {
        $scope.editMode = false;
        $scope.Giro = {};
        $scope.titulo = "Asignar Paquete"
        $("#modalAsignarPaquete").openModal();
    }

    $scope.modificarPaquete = function(paquete){
        $scope.active = "active";
        $scope.editMode = true;
        $scope.Paquete = paquete;
        $scope.titulo = "Modificar paquete";
        $("#modalAsignarPaquete").openModal();
    }

    $scope.guardarPaquete = function(){
        var object = {
            ide_remitente : $scope.Paquete.ide_remitente,
            nombres_remitente : $scope.Paquete.nombres_remitente,
            tel_remitente : $scope.Paquete.tel_remitente,
            ide_receptor : $scope.Paquete.ide_receptor,
            nombres_receptor : $scope.Paquete.nombres_receptor,
            tel_receptor : $scope.Paquete.tel_receptor,
            origen : $scope.Paquete.origen.nombre,
            direccionO : $scope.Paquete.direccionO,
            destino : $scope.Paquete.destino.nombre,
            direccionD : $scope.Paquete.direccionD,
            vehiculo : $scope.Vehiculo,
            descripcion_paquete : $scope.Paquete.descripcion_paquete
        }

        var promisePost = serviceEmpresaServicios.postPaquete(object);
        promisePost.then(function (pl) {
                $("#modalAsignarPaquete").closeModal();
                cargarPaquetes();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.updatePaquete = function(id){
        var object = {
            ide_remitente : $scope.Paquete.ide_remitente,
            nombres_remitente : $scope.Paquete.nombres_remitente,
            tel_remitente : $scope.Paquete.tel_remitente,
            ide_receptor : $scope.Paquete.ide_receptor,
            nombres_receptor : $scope.Paquete.nombres_receptor,
            tel_receptor : $scope.Paquete.tel_receptor,
            origen : $scope.Paquete.origen.nombre,
            direccionO : $scope.Paquete.direccionO,
            destino : $scope.Paquete.destino.nombre,
            direccionD : $scope.Paquete.direccionD,
            vehiculo : $scope.Vehiculo,
            descripcion_paquete : $scope.Paquete.descripcion_paquete
        }

        var promisePut = serviceEmpresaServicios.putPaquete(object, id );
        promisePut.then(function (pl) {
                $("#modalAsignarPaquete").closeModal();
                cargarPaquetes();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.deletePaquete = function(id){
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = serviceEmpresaServicios.deletePaquete(id);
            promiseDelete.then(function (pl) {
                    cargarPaquetes();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }

    function cargarVehiculoEnTurno(){
        var promiseGet = serviceEmpresaServicios.getVehiculoEnTurno();
        promiseGet.then(function (pl) {
            $scope.Vehiculo = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function loadCiudades(){
        ciudadesService.getAll().then(success, error);
        function success(p) {
            $scope.ciudades = p.data;
        }
        function error(error) {
            console.log('Error al cargar la ciudades', error);
        }
    }
})