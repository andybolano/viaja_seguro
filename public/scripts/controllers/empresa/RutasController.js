/**
 * Created by tav0 on 12/01/16.
 */
app.controller('RutasController', RutasController);

function RutasController($scope, centralesService, rutasService){

    $scope.rutas = [];
    $scope.centrales = [];
    $scope.ruta = {};

    //funciones
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.eliminar = eliminar;

    function nuevo(){
        $scope.ruta = {};
        loadCentrales();
        $("#modalRutas").openModal();
    }

    function guardar(){
        rutasService.post($scope.ruta).then(success, error);
        function success(p) {
            $("#modalRutas").closeModal();
            loadRutas();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
        }
    }

    function eliminar(id){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            rutasService.delete(id).then(success, error);
        }
        function success(p) {
            Materialize.toast('Registro eliminado', 5000);
            loadRutas()
        }
        function error(error) {
            console.log('Error al eliminar', error);
        }
    }

    loadRutas();
    function loadRutas(){
        rutasService.getAll().then(success, error);
        function success(p) {
            $scope.rutas = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
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

}