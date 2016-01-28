app.controller('ConductorController', function ($scope, ConductorServicio, VehiculoServicio) {
    $scope.Conductores = [];
    $scope.conductor = {};
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarConductores();
    cargarDocumentacion();

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
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoConductor = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Conductor = {};
        $scope.titulo = "Registrar Conductor";
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
            $scope.guardarVehiculo();
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
        var promisePut = ConductorServicio.put(object,$scope.Conductor.id);
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
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                    cargarConductores();
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }


    $scope.guardarVehiculo = function(){
        var object = {
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
        var promisePost = VehiculoServicio.post(object, $scope.Conductor.identificacion);
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
                //location.reload();
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

    function cargarDocumentacion(){
        var promiseGet = VehiculoServicio.getDocumentacion();
        promiseGet.then(function (pl) {
            $scope.Documentacion = pl.data;
            console.log($scope.Documentacion);
        },function (errorPl) {
            Materialize.toast('Ocurrio un error al cargar los documentos', 5000, 'rounded');
        });
    }

})