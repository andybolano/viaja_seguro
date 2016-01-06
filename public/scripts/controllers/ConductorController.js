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
        $scope.titulo = "Crear Conductor"
        $("#modalNuevoConductor").openModal();
    }

    $scope.guardar = function  () {
        var object = {
            id : $scope.Conductor.id,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo
        };

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
            id : $scope.Conductor.id,
            nombres : $scope.Conductor.nombres,
            apellidos : $scope.Conductor.apellidos,
            telefono : $scope.Conductor.telefono,
            direccion : $scope.Conductor.direccion,
            correo: $scope.Conductor.correo,
        };
        var promisePut = ConductorServicio.put(object,$scope.Conductor.id);
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
        //alert(id);
        var promiseDelete = ConductorServicio.delete(id);
        promiseDelete.then(function (pl) {
                cargarConductores();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }
})