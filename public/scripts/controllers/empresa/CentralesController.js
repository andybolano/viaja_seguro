/**
 * Created by tav0 on 12/01/16.
 */
app.controller('CentralesController', CentralesController, ['MapController']);

function CentralesController($scope, centralesService, ciudadesService, authService, MarkerCreatorService){

    $scope.selectedCentral = {};
    $scope.centrales = [];
    $scope.servicios = [];
    $scope.ciudades = [];
    $scope.editMode = false;
    $scope.nombreForm = "";
    $scope.active = "";

    //funciones
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.actualizar = actualizar;
    $scope.update = update;
    $scope.eliminar = eliminar;

    $scope.openCiudades = openCiudades;
    $scope.selecionarCiudad = selecionarCiudad;

    $scope.generarDatosAcceso = generarDatosAcceso;

    init();
    function init(){
        $scope.selectedCentral = {};
        $scope.centrales = [];
        loadCentrales();
    }

    function loadCentrales(){
        centralesService.getAll().then(success, error);
        function success(p) {
            $scope.centrales = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function nuevo(){
        $scope.selectedCentral = {};
        $scope.selectedCentral.usuario = {};
        $scope.nombreForm = "Nueva Central";
        $scope.active = "";
        $scope.editMode = false;
        $scope.fileimage = null;
        $("#modalNuevaCentral").openModal();
    }

    function guardar(){
        centralesService.post($scope.selectedCentral).then(success, error);
        function success(p) {

            $("#modalNuevaCentral").closeModal();
            $scope.selectedCentral = p.data;
            $scope.centrales.push($scope.selectedCentral);
            init();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
        }
    }

    function actualizar(central){
        $scope.selectedCentral = central;
        $scope.editMode = true;
        $scope.nombreForm = "Modificar Central";
        $scope.active = "active";
        $("#modalNuevaCentral").openModal();
        $scope.mapa = {};
        $scope.mapa.latitude = central.miDireccionLa;
        $scope.mapa.longitude = central.miDireccionLo;
        $scope.map = {
            center: {
                latitude: $scope.mapa.latitude,
                longitude: $scope.mapa.longitude
            },
            zoom: 15,
            markers: [],
            control: {},
            options: {
                scrollwheel: true
            }
        };
        $scope.map.markers.push($scope.mapa);
    }

    function update(){
        centralesService.put($scope.selectedCentral, $scope.selectedCentral.id).then(success, error);
        function success(p) {
            $("#modalNuevaCentral").closeModal();
            $scope.editMode = false;
            init();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al actualizar', error);
        }
    }

    function eliminar(id){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            centralesService.delete(id).then(success, error);
        }
        function success(p) {
            init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            console.log('Error al eliminar', error);
        }
    }

    function selecionarCiudad(ciudad){
        $scope.selectedCentral.ciudad = ciudad;
        $("#modalSeleccionarCiudad").closeModal();
    }

    function openCiudades(){
        if(!$scope.editMode) {
            loadCiudades();
            $("#modalSeleccionarCiudad").openModal();
        }
    }

    function loadCiudades(){
        ciudadesService.getAll().then(success, error);
        function success(p) {
            $scope.ciudades = p.data;
        }
        function error(error) {
            console.log('Error al cargar la ciudades', error);
        }
    }

    function generarDatosAcceso(){
        $scope.selectedCentral.usuario.nombre = (
            authService.currentUser().empresa.nombre.toLowerCase()+
            '_'+$scope.selectedCentral.ciudad.nombre.toLowerCase()+
            '_'+Math.floor((Math.random() * (999 - 101 + 1)) + 101)).replace(/\s+/g, '');
        $scope.selectedCentral.usuario.contrasena = $scope.selectedCentral.usuario.nombre;
    }

}