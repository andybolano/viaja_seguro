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
    $scope.generarDatosAcceso = generarDatosAcceso;

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
        $scope.selectedEmpresa.usuario = {};
        $scope.nombreForm = "Nueva Empresa";
        $scope.active = "";
        $scope.editMode = false;
        $scope.fileimage = null;
        loadServicios();
        $("#modalNuevaEmpresa").openModal();
    }

    function guardar(){
        updateServicios($scope.selectedEmpresa);
        empresasService.post($scope.selectedEmpresa).then(success, error);
        function success(p) {

            $("#modalNuevaEmpresa").closeModal();
            $scope.selectedEmpresa = p.data;
            modificarImagen();
            //$scope.empresas.push($scope.selectedEmpresa);
            init();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
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
        if($scope.fileimage) {
            var data = new FormData();
            data.append('logo', $scope.fileimage);
            empresasService.postLogo($scope.selectedEmpresa.id, data).then(success, error);
            function success(p) {
                init();
                $scope.selectedEmpresa.logo = p.data.nombrefile;
                Materialize.toast('Logo guardado correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }
    }

    function update(){
        updateServicios($scope.selectedEmpresa);
        empresasService.put($scope.selectedEmpresa, $scope.selectedEmpresa.id).then(success, error);
        function success(p) {
            $("#modalNuevaEmpresa").closeModal();
            $scope.editMode = false;
            modificarImagen();
            init();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al actualizar', error);
        }
    }

    function eliminar(codigo){
        if(confirm('¿Deseas eliminar el registro? \n no es recomendable') ==true) {
            empresasService.delete(codigo).then(success, error);
        }
        function success(p) {
            init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            console.log('Error al eliminar', error);
        }
    }

    function generarDatosAcceso()
    {
        $scope.selectedEmpresa.usuario.nombre = $scope.selectedEmpresa.nombre.toLowerCase()+'_'+Math.floor((Math.random() * (999 - 101 + 1)) + 101);
        $scope.selectedEmpresa.usuario.contrasena = $scope.selectedEmpresa.usuario.nombre;
    }

}