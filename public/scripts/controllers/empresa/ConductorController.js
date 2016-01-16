app.controller('ConductorController', function ($scope, ConductorServicio) {
    $scope.Conductores = [];
    $scope.conductor = {};
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarConductores();

    function initialize(){
        $scope.conductor = {
            id: "",
            nomnbres: ""
        }
    }


    function cargarConductores() {
        var finalizar = false;
        var promiseGet = ConductorServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Conductores = pl.data;
            angular.forEach($scope.Conductores, function(conductor){
                if(finalizar == false){
                    if(conductor.vehiculo_id == null){
                        if (confirm('El conductor ' + conductor.nombres + " " + conductor.apellidos + " No tiene vehiculo asociado desea registrar uno?") == true) {
                            $scope.editMode = false;
                            $scope.active = "";
                            $scope.Conductor = {};
                            $scope.titulo = "Asignar vehiculo a " + conductor.nombres + " " + conductor.apellidos;
                            finalizar = true;
                            $("#modalAsignarVehiculoC").openModal();
                        }
                    }
                }
            });
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoConductor = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Conductor = {};
        $scope.titulo = "Crear Conductor"
        $("#modalNuevoConductor").openModal();
    }

    $scope.guardar = function  () {
        var object = {
            identificacion : $scope.Conductor.identificacion,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo
        };
        console.log(object);
        var promisePost = ConductorServicio.post(object);
        promisePost.then(function (pl) {
                $("#modalNuevoConductor").closeModal();
                cargarConductores();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.modificar = function  (conductor) {
        $scope.editMode = true;
        $scope.titulo = "Modificar conductor"
        $scope.active = "active";
        $scope.Conductor = conductor;


        $("#modalNuevoConductor").openModal();
    };

    $scope.update = function  () {
        var object = {
            identificacion : $scope.Conductor.identificacion,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo
        };
        console.log(object);
        var promisePut = ConductorServicio.put(object,$scope.Conductor.identificacion);
        promisePut.then(function (pl) {
                $("#modalNuevoConductor").closeModal();
                cargarConductores();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }


    $scope.eliminar = function  (id) {
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = ConductorServicio.delete(id);
            promiseDelete.then(function (pl) {
                    cargarConductores();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }

    //if ($scope.Vehiculo == null) {
    //    if (confirm('El conductor ' + pl.data.nombres + " " + pl.data.apellidos + " No tiene vehiculo asociado desea registrar uno?") == true) {
    //        $("#modalAsignarVehiculoC").OpenModal();
    //    }
    //} else {
    //    cargarConductores();
    //}

    $scope.consutarVehiculo = function(id){
        var promiseGet = ConductorServicio.getVehiculoC(id);
        promiseGet.then(function(pl){
            $scope.Vehiculo = pl.data;
            if ($scope.Vehiculo == null) {
                if (confirm('El conductor ' + pl.data.nombres + " " + pl.data.apellidos + " No tiene vehiculo asociado desea registrar uno?") == true) {
                    $("#modalAsignarVehiculoC").OpenModal();
                }
            } else {
                cargarConductores();
            }
        });
    }


})