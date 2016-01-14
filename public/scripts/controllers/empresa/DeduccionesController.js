app.controller('DeduccionesController', function ($scope, DeduccionesServicio) {
    $scope.Deducciones = [];
    $scope.Deduccion = {};
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarDeducciones();

    function initialize(){
        $scope.Deduccion = {
            nombre: "",
            descripcion: "",
            valor: "",
            estado: ""
        }
    }
    function cargarDeducciones() {
        var promiseGet = DeduccionesServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Deducciones = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevaDeduccion = function() {
        $scope.editMode = false;
        $scope.active = "";
        $scope.titulo = "Nueva deducción"
        $("#modalNuevaDeduccion").openModal();
    }

    $scope.updateEstado = function(deduccion){
        var nuevoEstado;
        if (deduccion.estado == 'true'){
            nuevoEstado = 'false';
        }else{
            nuevoEstado = 'true';
        }
        //alert(JSON.stringify(object));
        var promisePut = DeduccionesServicio.updateEstado(deduccion.id, nuevoEstado);
        promisePut.then(function (pl) {
            cargarDeducciones();
            Materialize.toast(pl.data.message, 5000, 'rounded');
        }, function (errorPl) {
                console.log('Error al hacer la solicitud', errorPl);
            });
    }

    $scope.guardar = function  () {
        var formData=new FormData();
        formData.append('nombre',$scope.Deduccion.nombre);
        formData.append('descripcion',$scope.Deduccion.descripcion);
        formData.append('valor',$scope.Deduccion.valor);
        formData.append('estado',$scope.Deduccion.estado);
        var promiseGet = DeduccionesServicio.post(formData);
        promiseGet.then(function (pl) {
                $('#modalNuevaDeduccion').closeModal();
                cargarDeducciones();
                Materialize.toast(d.data.message,3000,'rounded');
            },
            function (err) {
                if(err.status == 401){
                    alert(err.data.message);
                    console.log(err.data.exception);
                }else{
                    $('#modalProductos').closeModal();
                    Materialize.toast("Error al procesar la solicitud",3000,'rounded');
                }
                console.log(err);
            });
    }

    $scope.eliminar = function (deduccion){
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

})