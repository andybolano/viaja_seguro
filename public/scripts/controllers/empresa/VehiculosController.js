app.controller('VehiculosController', function ($scope, VehiculoServicio) {
    $scope.Vehiculos = [];
    $scope.vehiculo = {};

    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarVehiculos();

    function initialize(){
        $scope.vehiculo = {
            placa: "",
            modelo: ""
        }
    }

    function cargarVehiculos() {
        var promiseGet = VehiculoServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Vehiculos = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
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
        $scope.titulo = "Seleccione el conductor para el vehiculo";
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
        $scope.Vehiculo.conductor = conductor;
        $scope.active = 'active';
        $("#modalBuscarconductor").closeModal();
    }
})