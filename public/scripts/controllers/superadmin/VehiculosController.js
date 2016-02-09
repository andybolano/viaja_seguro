app.controller('VehiculosController', function ($scope, VehiculoServicio, centralesService, empresasService) {
    $scope.empresas = [];
    $scope.centrales = [];
    $scope.Vehiculos = [];
    $scope.vehiculo = {};
    $scope.selectEmpresa = {};
    $scope.selectCentral = {}

    $scope.active;

    $scope.cargarVehiculos = cargarVehiculos;
    $scope.cargarVehiculosDeNuevo = cargarVehiculosDeNuevo;

    cargarEmpresas();
    function cargarEmpresas(){
        empresasService.getAll().then(success, error);
        function success(p) {
            $scope.empresas = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function cargarCentrales(id){
        $scope.centales = [];
        centralesService.getAll(id).then(success, error);
        function success(p) {
            $scope.centrales = p.data;
            $scope.centrales.unshift({ciudad:{nombre:'Todas'}});
            $scope.selectedCentral = $scope.centrales[0];
        }
        function error(error) {
            console.log('Error al cargar centales', error);
        }
    }

    function cargarVehiculos(selectEmpresa) {
        $scope.selectEmpresa =selectEmpresa;
        var promiseGet = VehiculoServicio.getFiltering(selectEmpresa.id);
        promiseGet.then(function (pl) {
            $scope.Vehiculos = pl.data;
            Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
            cargarCentrales(selectEmpresa.id);
        },function (errorPl) {
            Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
        });
    }

    function cargarVehiculosDeNuevo(selectCentral) {
        var promiseGet = (selectCentral.ciudad.nombre == 'Todas') ? VehiculoServicio.getFiltering($scope.selectEmpresa.id) : VehiculoServicio.getFiltering(null, selectCentral.id);
        promiseGet.then(function (pl) {
            $scope.Vehiculos = pl.data;
            Materialize.toast('Vehiculos cargados correctamente', 5000, 'rounded');
            init();
        },function (errorPl) {
            Materialize.toast('Ocurrio un error al cargar los vehiculos', 5000, 'rounded');
        });
    }

    $scope.modificar = function  (vehiculo) {
        //$scope.editMode = true;
        $scope.titulo = "VEHICULO CON PLACA: " + vehiculo.placa;
        $scope.active = "active";
        $scope.Vehiculo = vehiculo;
        $("#modalNuevoVehiculo").openModal();
    };

})