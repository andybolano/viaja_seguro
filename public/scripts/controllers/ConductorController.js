app.controller('ConductorController', function ($scope, ConductorServicio) {
    $scope.Conductores = [];

    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarConductores();

    function cargarConductores() {
        var promiseGet = ConductorServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Conductores = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function loadVendedores () {
        var promiseGet = ConductorServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Conductores = pl.conductores;
        }, function (errorPl) {
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
})