/**
 * Created by tav0 on 12/01/16.
 */
app.controller('CentralesController', CentralesController);

function CentralesController($scope, centralesService){

    $scope.selectedCentral = {};
    $scope.centrales = [];
    $scope.servicios = [];
    $scope.editMode = false;
    $scope.nombreForm = "";
    $scope.active = "";

    //funciones
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.actualizar = actualizar;
    $scope.update = update;
    $scope.eliminar = eliminar;

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
            //init();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            cconsole.log('Error al guardar', error);
        }
    }

    function actualizar(empresa){
        $scope.selectedCentral = empresa;
        $scope.editMode = true;
        $scope.nombreForm = "Modificar Central";
        $scope.active = "active";
        $("#modalNuevaCentral").openModal();
    }

    function update(){
        updateServicios($scope.selectedCentral);
        success(1);
        //centralesService.put($scope.selectedCentral, $scope.selectedCentral.codigo).then(success, error);
        function success(p) {
            $("#modalNuevaCentral").closeModal();
            $scope.editMode = false;
            modificarImagen();
            //init();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            cconsole.log('Error al actualizar', error);
        }
    }

    function eliminar(codigo){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            success(1);
            //centralesService.delete(codigo).then(success, error);
        }
        function success(p) {
            //init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            cconsole.log('Error al eliminar', error);
        }
    }

}