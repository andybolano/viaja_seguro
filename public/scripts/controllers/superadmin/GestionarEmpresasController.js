/**
 * Created by tav0 on 4/01/16.
 */
app.controller('GestionarEmpresasController', GestionarEmpresasController);

function GestionarEmpresasController($scope, empresasService, serviciosEmpresaService){

    $scope.selectedEmpresa = {};
    $scope.empresas = [];
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
    $scope.modificarImagen = modificarImagen;

    init();
    function init(){
        $scope.selectedEmpresa = {};
        $scope.empresas = [];
        loadEmpresas();
        loadServicios();
    }

    function loadEmpresas(){
        empresasService.getAll().then(success, error);
        function success(p) {
            $scope.empresas = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function loadServicios(){
        serviciosEmpresaService.getAll().then(success, error);
        function success(p) {
            $scope.servicios = p.data;
        }
        function error(error) {
            console.log('Error al cargar Servicios', error);
        }
    }

    function checkServicios(empresa){
        for(var i =0; i<$scope.servicios.length; i++) {
            $scope.servicios[i].selected = false;
            for (var j = 0; j < empresa.servicios.length; j++) {
                if($scope.servicios[i].id == empresa.servicios[j].id){
                    $scope.servicios[i].selected = true;
                    j = empresa.servicios.length;
                }
            }
        }
    }

    function updateServicios(empresa){
        for(var i =0; i<$scope.servicios.length; i++) {
            var esta = false;
            var index = -1;
            for (var j = 0; j < empresa.servicios.length; j++) {
                if($scope.servicios[i].id == empresa.servicios[j].id){
                    esta = true;
                    index = j;
                    j = empresa.servicios.length;
                }
            }
            if(!esta && $scope.servicios[i].selected){
                empresa.servicios.push({
                    id: $scope.servicios[i].id,
                    concepto: $scope.servicios[i].concepto
                });
            } else if (esta  && !$scope.servicios[i].selected){
                empresa.servicios.splice(index, 1);
            }
        }
    }

    function nuevo(){
        $scope.selectedEmpresa = {};
        $scope.selectedEmpresa.servicios = [];
        $scope.nombreForm = "Nueva Empresa";
        $scope.active = "";
        $scope.editMode = false;
        loadServicios();
        $("#modalNuevaEmpresa").openModal();
    }

    function guardar(){
        updateServicios($scope.selectedEmpresa);
        $scope.empresas.push($scope.selectedEmpresa);
        success(1);
        empresasService.post($scope.selectedEmpresa).then(success, error);
        function success(p) {
            $("#modalNuevaEmpresa").closeModal();
            //init();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            cconsole.log('Error al guardar', error);
        }
    }

    function actualizar(empresa){
        checkServicios(empresa);
        $scope.selectedEmpresa = empresa;
        $scope.editMode = true;
        $scope.nombreForm = "Modificar Empresa";
        $scope.active = "active";
        $("#modalNuevaEmpresa").openModal();
    }

    function modificarImagen(){
        alert(JSON.stringify($scope.selectedEmpresa.logo));
    }

    function update(){
        updateServicios($scope.selectedEmpresa);
        success(1);
        //empresasService.put($scope.selectedEmpresa, $scope.selectedEmpresa.id).then(success, error);
        function success(p) {
            $("#modalNuevaEmpresa").closeModal();
            $scope.editMode = false;
            //init();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            cconsole.log('Error al actualizar', error);
        }
    }

    function eliminar(id){
        success(1);
        //empresasService.delete($scope.selectedEmpresa.id).then(success, error);
        function success(p) {
            $("#modalNuevaEmpresa").closeModal();
            //init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            cconsole.log('Error al eliminar', error);
        }
    }

}