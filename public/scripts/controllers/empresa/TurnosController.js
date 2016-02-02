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
    $scope.addPasajero = addPasajero;

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
        updateTurnos($scope.selectedRuta);
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
        turnosService.updateTurnos(ruta.id, {'turnos' : ruta.turnos}).then(success, error);
        function success(p) {
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
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

    function cargarVehiculoConductor(conductor_id){
        turnosService.cargarVehiculoConductor(conductor_id).then(success, error);
        function success(p) {
            $scope.vehiculo = p.data;
        }
        function error(error) {
            console.log('Error los datos del vehiculo', error);
        }
    }

    //SERVICIOS
    $scope.Pasajeros = {};
    $scope.Paquetes = {};
    $scope.Giros = {};
    $scope.listaPasajeros = {};
    $scope.listaPaquetes = {};
    $scope.listaGiros = {};

    function refrescarPasajeros(conductor_id){
        document.getElementById("guardar").disabled = false;
        document.getElementById("actualizar").disabled = true;
        turnosService.refrescarPasajeros(conductor_id).then(success, error);
        function  success(p){
            $scope.listaPasajeros = p.data;
            $scope.Pasajeros = "";
        }
        function error(error){
            console.log('error a traer la lista de pasajeros')
        }
    }

    function addPasajero(conductor){
        $scope.conductor = conductor;
        cargarVehiculoConductor($scope.conductor.id);
        refrescarPasajeros($scope.conductor.id);
        $('#modalAddPasajero').openModal();
    }

    $scope.asignarPasajero = function(){
        $scope.Pasajeros.conductor_id = $scope.conductor.id;
        if($scope.vehiculo.cupos == 0){
            Materialize.toast('Este conductor no tiene cupos disponibles','5000',"rounded");
        }else{
            turnosService.asignarPasajero($scope.Pasajeros).then(success, error);
            function  success(p){
                $scope.vehiculo.cupos = $scope.vehiculo.cupos-1;
                var obj = {
                    cupos : $scope.vehiculo.cupos
                }
                turnosService.updateCuposVehiculo($scope.vehiculo.id, obj);
                refrescarPasajeros($scope.conductor.id);
            }
            function error(error){
                console.log('Error al guardar')
            }
        }
    }

    $scope.cargarModificarPasajero = function(item){
        document.getElementById("actualizar").disabled = false;
        document.getElementById("guardar").disabled = true;
        $scope.Pasajeros = item;
    };

    $scope.modificarPasajero = function(){
        turnosService.modificarPasajero($scope.Pasajeros.id, $scope.Pasajeros).then(success, error);
        function  success(p){
            Materialize.toast(p.message,'5000',"rounded");
            refrescarPasajeros($scope.conductor.id);
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
        }
        function error(error){
            console.log('Error al guardar')
        }
    };

    $scope.limpiar = function(){
        document.getElementById("guardar").disabled = false;
        document.getElementById("actualizar").disabled = true;
        $scope.Pasajeros = "";
        $scope.Paquetes = "";
        $scope.Giros = "";
    };
}
