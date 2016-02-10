app.controller('ConductorCentralController', function ($scope, conductorService) {
    $scope.Conductores = {};
    $scope.conductor = {};
    $scope.activos = true;


    initialize();
    cargarConductores();
    function initialize(){
        $scope.conductor = {}
    }

    function cargarConductores() {
        $scope.Conductores = {};
        var promiseGet = conductorService.getAll();

        promiseGet.then(function (p) {
            $scope.Conductores = p.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }
})