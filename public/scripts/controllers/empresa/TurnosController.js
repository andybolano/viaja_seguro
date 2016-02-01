/**
 * Created by tav0 on 12/01/16.
 */
app.controller('TurnosController', TurnosController);

function TurnosController($scope, turnosService){

    $scope.conductores = [];
    $scope.selectedTurno = {};
    $scope.rutas = [];
    $scope.selectedRuta = {};

    $scope.addNewConductor = addNewConductor;
    $scope.selectConductor = selectConductor;
    $scope.remove = remove;
    $scope.movedConductor = movedConductor;
    $scope.addConductor = addConductor;
    $scope.updateTurnos = updateTurnos;

    function addNewConductor(ruta){
        $scope.selectedRuta = ruta;
        cargarConductores();
        $("#modalBuscarconductor").openModal();
    }

    function selectConductor (conductor){
        var nuevoTurno = {
            'ruta_id': $scope.selectedRuta.id,
            'conductor_id': conductor.id,
            'turno': $scope.selectedRuta.turnos.length+1,
            'conductor': conductor
        };
        $scope.selectedRuta.turnos.push(nuevoTurno);
        $("#modalBuscarconductor").closeModal();
    }

    function remove(ruta, $index){
        ruta.turnos.splice($index, 1);
        updateTurnos(ruta);
    }

    function movedConductor(ruta, $index){
        ruta.turnos.splice($index, 1);
    }

    function addConductor(ruta){
        updateTurnos(ruta);
    }

    function updateTurnos(ruta){
        for(var i=0; i<ruta.turnos.length; i++){
            ruta.turnos[i].turno = i+1;
        }
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
