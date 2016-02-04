/**
 * Created by tav0 on 12/01/16.
 */
app.controller('ActividadesController', ActividadesController);

function ActividadesController($scope, actividadesService, $filter){

    $scope.actividades = [];
    $scope.actividadesFinalizadas = [];
    $scope.selectedActividad = {};
    $scope.editMode = false;

    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.actualizar = actualizar;
    $scope.update = update;

    function nuevo(){
        $scope.selectedActividad = {};
        $scope.active = "";
        $scope.nombreForm = "Agendar Nueva Actividad";
        $scope.selectedActividad.estado = 'Pendiente';
        $("#modalNuevaActividad").openModal();
    }


    function guardar(){
        var nActividad = {};
        nActividad.fecha = $filter('date')($scope.selectedActividad.fecha,'yyyy-MM-dd')+' '+
            $filter('date')($scope.selectedActividad.hora,'HH:mm:ss');
        nActividad.nombre = $scope.selectedActividad.nombre;
        nActividad.descripcion = $scope.selectedActividad.descripcion;
        nActividad.estado = $scope.selectedActividad.estado;
        actividadesService.post(nActividad).then(success, error);
        function success(p) {
            $("#modalNuevaActividad").closeModal();
            loadAvtividades();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
        }
    }

    function actualizar(actividad){
        $scope.selectedActividad = actividad;
        $scope.editMode = true;
        $scope.nombreForm = "Modificar Actividad";
        $scope.active = "active";
        $("#modalNuevaActividad").openModal();
    }

    function update(){
        var nActividad = {};
        nActividad.fecha = $filter('date')($scope.selectedActividad.fecha,'yyyy-MM-dd')+' '+
            $filter('date')($scope.selectedActividad.hora,'HH:mm:ss');
        nActividad.nombre = $scope.selectedActividad.nombre;
        nActividad.descripcion = $scope.selectedActividad.descripcion;
        nActividad.estado = $scope.selectedActividad.estado;
        nActividad.id = $scope.selectedActividad.id;
        actividadesService.put(nActividad).then(success, error);
        function success(p) {
            $("#modalNuevaActividad").closeModal();
            $scope.editMode = false;
            loadAvtividades();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al actualizar', error);
        }
    }

    loadAvtividades();
    function loadAvtividades(){
        actividadesService.getAll().then(success, error);
        function success(p) {
            for(var i=0; i<p.data.length; i++){
                p.data[i].fecha = new Date(p.data[i].fecha);
                p.data[i].hora = new Date(p.data[i].fecha);
                if(p.data[i].estado === "Finalizada"){
                    $scope.actividadesFinalizadas.push(p.data[i]);
                }else{
                    $scope.actividades.push(p.data[i]);
                }
            }
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }
}