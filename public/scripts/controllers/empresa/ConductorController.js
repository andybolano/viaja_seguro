app.controller('ConductorController', function ($scope, ConductorServicio, VehiculoServicio) {
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
                    if(conductor.vehiculo_id == ""){
                        if (confirm('El conductor ' + conductor.nombres + " " + conductor.apellidos + " No tiene vehiculo asociado desea registrar uno?") == true) {
                            $scope.editMode = false;
                            $scope.active = "";
                            $scope.Vehiculo = {};
                            $scope.Vehiculo.ide_conductor = conductor.identificacion;
                            $scope.titulo = "Asignar vehiculo a: " + (conductor.nombres + " " + conductor.apellidos).toUpperCase();
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
                Materialize.toast(pl.data.message, 5000, 'rounded');
                modificarImagen();
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
                Materialize.toast(pl.data.message, 5000, 'rounded');
                modificarImagen();
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

    $scope.guardarVehiculo = function(){
        var object = {
            ide_conductor : $scope.Vehiculo.ide_conductor,
            ide_propietario : $scope.Vehiculo.ide_propietario,
            nombre_propietario : $scope.Vehiculo.nombre_propietario,
            tel_propietario : $scope.Vehiculo.tel_propietario,
            placa : $scope.Vehiculo.placa,
            modelo : $scope.Vehiculo.modelo,
            color : $scope.Vehiculo.color,
            codigo_vial : $scope.Vehiculo.codigo_vial,
            cupos : $scope.Vehiculo.cupos
        };
        console.log(object);
        var promisePost = VehiculoServicio.post(object);
        promisePost.then(function (pl) {
                $("#modalAsignarVehiculoC").closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                $scope.modificarImagenVehiculo();
                cargarConductores();
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    function modificarImagen(){
        if($scope.fileimage) {
            var data = new FormData();
            data.append('imagen', $scope.fileimage);
            ConductorServicio.postImagen($scope.Conductor.identificacion, data).then(success, error);
            function success(p) {
                $scope.Conductor.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardado correctamente', 5000);
                cargarConductores();
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }
    }

    $scope.modificarImagenVehiculo = function (){
        if($scope.fileimageV) {
            var data = new FormData();
            data.append('imagenv', $scope.fileimageV);
            VehiculoServicio.postImagen($scope.Vehiculo.placa, data).then(success, error);
            function success(p) {
                $scope.Vehiculo.imagen = p.data.nombrefile;
                //Materialize.toast('Imagen guardada correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }
    }

})