/**
 * Created by tav0 on 12/01/16.
 */
app.controller('TurnosController', TurnosController);

function TurnosController($scope, turnosService){

    $scope.conductores = [];
    $scope.selectedConductor = {};
    $scope.rutas = [];
    $scope.selectedRuta = {};

    $scope.addConductor = addConductor;
    $scope.selectConductor = selectConductor;

    function addConductor(ruta){
        $scope.selectedRuta = ruta;
        $scope.selectedRuta.conductores = [];
        cargarConductores();
        $("#modalBuscarconductor").openModal();
    }

    function selectConductor (conductor){
        $scope.selectedRuta.conductores.push(conductor);
        $("#modalBuscarconductor").closeModal();
    }

    cargarRutas();
    function cargarRutas() {
        turnosService.getRutasCentral().then(success, error);
        function success(p) {
            $scope.rutas = p.data;
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }

    function cargarConductores() {
        turnosService.getAllConductores().then(success, error);
        function success(p) {
            $scope.conductores = p.data;
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }
}
