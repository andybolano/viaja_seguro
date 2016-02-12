app.controller('ConductorController', function ($scope, ConductorServicio, VehiculoServicio, $filter, centralesService) {
    $scope.Conductores = [];
    $scope.ConductoresInactivos = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    $scope.activos = true;
    cargarConductores();

    function cargarConductores() {
        $scope.Conductores = [];
        $scope.ConductoresInactivos = [];
        var promiseGet = ConductorServicio.getAll();
        promiseGet.then(function (p) {
            for(var i=0; i<p.data.length; i++){
                if(p.data[i].activo == true ){
                    $scope.Conductores.push(p.data[i]);
                }else{
                    $scope.ConductoresInactivos.push(p.data[i]);
                }
            }
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoConductor = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.titulo = "Registrar Conductor";
        $("#modalNuevoConductor").openModal();
    }

    $scope.limpiar = function(){
        $scope.Conductor = {};
    }

    $scope.guardar = function  () {
        var object = {
            identificacion : $scope.Conductor.identificacion,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo,

            vehiculo : {
                identificacion_propietario : $scope.Vehiculo.identificacion_propietario,
                nombre_propietario : $scope.Vehiculo.nombre_propietario,
                tel_propietario : $scope.Vehiculo.tel_propietario,
                placa : $scope.Vehiculo.placa,
                modelo : $scope.Vehiculo.modelo,
                color : $scope.Vehiculo.color,
                codigo_vial : $scope.Vehiculo.codigo_vial,
                cupos : $scope.Vehiculo.cupos,
                soat: $scope.Vehiculo.soat,
                fecha_soat: $filter('date')($scope.Vehiculo.fecha_soat, 'yyyy-MM-dd'),
                tecnomecanica: $scope.Vehiculo.tecnomecanica,
                fecha_tecnomecanica: $filter('date')($scope.Vehiculo.fecha_tecnomecanica, 'yyyy-MM-dd'),
                tarjeta_propiedad: $scope.Vehiculo.tarjeta_propiedad
            }
        };
        console.log(object);
        var promisePost = ConductorServicio.post(object);
        promisePost.then(function (pl) {
            $("#modalNuevoConductor").closeModal();
            Materialize.toast(pl.data.message, 5000, 'rounded');
            modificarImagen();
            modificarImagenVehiculo();
            location.reload();
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.modificar = function  (conductor) {
        $scope.editMode = true;
        $scope.oculto = false;
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
            correo: $scope.Conductor.correo,
            activo: $scope.Conductor.activo
        };
        console.log(object);
        var promisePut = ConductorServicio.put(object,$scope.Conductor.id);
        promisePut.then(function (pl) {
                $("#modalNuevoConductor").closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                modificarImagen();
                 cargarConductores();
                location.reload();
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.openhabilitar = function(conductor){
        $scope.editMode = true;
        $scope.oculto = false;
        $scope.titulo = "Habilitar conductor"
        $scope.active = "active";
        $scope.Conductor = conductor;
        loadCentrales();
        $("#modalNuevoConductor").openModal();
    };

    $scope.habilitar = function  () {
        var object = {
            identificacion : $scope.Conductor.identificacion,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo,
            central_id: $scope.Conductor.central.id,
            activo: true
        };
        var promisePut = ConductorServicio.put(object,$scope.Conductor.id);
        promisePut.then(function (pl) {
                Materialize.toast('Conductor habilitado', 5000, 'rounded');
                cargarConductores();
                $("#modalNuevoConductor").closeModal();
            },
            function (errorPl) {
                console.log('Error habilitar conductor', errorPl);
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

    function modificarImagen(){
        if($scope.fileimage) {
            var data = new FormData();
            data.append('imagen', $scope.fileimage);
            ConductorServicio.postImagen($scope.Conductor.identificacion, data).then(success, error);
            function success(p) {
                $scope.Conductor.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardado correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }
    }

    function modificarImagenVehiculo(){
        if($scope.fileimageV) {
            var data = new FormData();
            data.append('imagenv', $scope.fileimageV);
            VehiculoServicio.postImagen($scope.Vehiculo.placa, data).then(success, error);
            function success(p) {
                $scope.Vehiculo.imagen = p.data.nombrefile;
                cargarConductores();
                Materialize.toast('Imagen guardada correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }
    }

    function loadCentrales(){
        if(!$scope.centrales) {
            centralesService.getAll().then(success, error);
            function success(p) {
                $scope.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar centrales', error);
            }
        }
    }

})