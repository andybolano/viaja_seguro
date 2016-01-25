app.controller('VehiculosController', function ($scope, VehiculoServicio) {
    $scope.Vehiculos = [];
    $scope.vehiculo = {};

    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarVehiculos();
    cargarDocumentacion();

    function init(){
        $scope.Vehiculo = {}
    }

    function cargarVehiculos() {
        var promiseGet = VehiculoServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Vehiculos = pl.data;
            Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
            init();
        },function (errorPl) {
            Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
        });
    }

    $scope.nuevoVehiculo = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Vehiculo = {};
        $scope.titulo = "Registrar nuevo vehiculo";
        $("#modalNuevoVehiculo").openModal();
    }

    $scope.buscarConductor = function(){
        $scope.titulo = "Registrar vehiculo";
        $("#modalBuscarconductor").openModal();
    }

    $scope.modificar = function  (vehiculo) {
        $scope.editMode = true;
        $scope.titulo = "Modificar vehiculo"
        $scope.active = "active";
        $scope.Vehiculo = vehiculo;
        $("#modalNuevoVehiculo").openModal();
    };

    $scope.selectConductor = function (conductor){
        $scope.Vehiculo.ide_conductor = conductor.identificacion;
        //$scope.Vehiculo.nombreConductor = conductor.nombres + " " + conductor.apellidos;
        $scope.active = 'active';
        $("#modalBuscarconductor").closeModal();
    }

    $scope.guardar = function(){
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
                $("#modalNuevoVehiculo").closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                $scope.modificarImagenVehiculo();
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.update = function  () {
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
        var promisePut = VehiculoServicio.put(object,$scope.Vehiculo.placa);
        promisePut.then(function (pl) {
                $("#modalNuevoVehiculo").closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                $scope.modificarImagenVehiculo();
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.eliminar = function  (id) {
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = VehiculoServicio.delete(id);
            promiseDelete.then(function (pl) {
                    cargarVehiculos();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }

    $scope.modificarImagenVehiculo = function (){
        if($scope.fileimageV) {
            var data = new FormData();
            data.append('imagenv', $scope.fileimageV);
            VehiculoServicio.postImagen($scope.Vehiculo.placa, data).then(success, error);
            function success(p) {
                location.reload();
                cargarVehiculos();
                Materialize.toast('Imagen guardada correctamente', 5000);
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
            //Materialize.toast('Ocurrio un error al cargar los documentos', 5000, 'rounded');
        });
    }
})