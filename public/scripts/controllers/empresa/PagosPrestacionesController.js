/**
 * Created by tav0 on 12/01/16.
 */
app.controller('PagosPrestacionesController', PagosPrestacionesController);

function PagosPrestacionesController($scope, prestacionesService){

    $scope.prestaciones = [];
    $scope.selectedPrestacion = {};
    $scope.selectedConductorNombre = '';
    $scope.selectedConductorCedula = '';
    $scope.pagosPrestacion = [];
    $scope.nuevaPrestacion = {};
    $scope.prestacionAvtive = false;

    $scope.loadPagos = loadPagos;
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.selectConductor = selectConductor;
    $scope.buscarConductor = buscarConductor;

    function loadPagos(prestacion){
        $scope.prestacionAvtive = true;
        $scope.selectedPrestacion = prestacion;
        prestacionesService.getPagos($scope.selectedPrestacion.id).then(success, error);
        function success(p) {
            $scope.pagosPrestacion = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function nuevo(){
            $scope.nuevaPrestacion = {};
            $("#modalRegistrarPago").openModal();
    }

    function guardar(){
        $scope.nuevaPrestacion.prestacion_id = $scope.selectedPrestacion.id;
        prestacionesService.post($scope.nuevaPrestacion).then(success, error);
        function success(p) {
            loadPagos($scope.selectedPrestacion);
            $("#modalRegistrarPago").closeModal();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function buscarConductor(){
        $scope.selectedConductor = {};
        $scope.selectedConductorNombre = '';
        $("#modalBuscarconductor").openModal();
    }

    loadPrestaciones();
    function loadPrestaciones(){
        prestacionesService.getAll().then(success, error);
        function success(p) {
            $scope.prestaciones = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }


    function selectConductor (conductor){
        $scope.selectedConductorNombre = conductor.nombres+' '+conductor.apellidos;
        $scope.selectedConductorCedula = conductor.identificacion;
        $scope.nuevaPrestacion = {
            conductor_id : conductor.id
        };
        $("#modalBuscarconductor").closeModal();
    }
}