app.controller('DeduccionesController', function ($scope, DeduccionesServicio) {
    $scope.Deducciones = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarDeducciones();

    function cargarDeducciones() {
        var promiseGet = DeduccionesServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Deducciones = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevaDeduccion = function() {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Deduccion = {};
        $scope.titulo = "Nueva deducción"
        $("#modalNuevaDeduccion").openModal();
    }
})