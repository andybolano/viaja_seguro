app.controller('DeduccionesController', function ($scope, DeduccionesServicio) {
    $scope.Deducciones = [];
    $scope.Deduccion = {};
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarDeducciones();
    initialize();

    function initialize(){
        $scope.Deduccion = {}
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
        $scope.Deduccion = {};
        $scope.editMode = false;
        $scope.active = "";
        $scope.titulo = "Nueva deducción"
        $("#modalNuevaDeduccion").openModal();
    }

    $scope.modificar = function(deduccion){
        $scope.editMode = true;
        $scope.Deduccion = deduccion;
        $scope.active = "active";
        $scope.titulo = "Modificar deducción"
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

        var object = {
            nombre: $scope.Deduccion.nombre,
            descripcion: $scope.Deduccion.descripcion,
            valor: $scope.Deduccion.valor,
            estado: $scope.Deduccion.estado
        }
        var promisePost = DeduccionesServicio.post(object);
        promisePost.then(function (pl) {
                $('#modalNuevaDeduccion').closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                cargarDeducciones();
            },
            function (err) {
                $('#modalNuevaDeduccion').closeModal();
                Materialize.toast("Error al procesar la solicitud",3000,'rounded');
                console.log(err);
            });
    }

    $scope.update = function(){
        var object = {
            nombre: $scope.Deduccion.nombre,
            descripcion: $scope.Deduccion.descripcion,
            valor: $scope.Deduccion.valor,
            estado: $scope.Deduccion.estado
        }
        var promisePut = DeduccionesServicio.put(object, $scope.Deduccion.id);
        promisePut.then(function (pl) {
                $('#modalNuevaDeduccion').closeModal();
                cargarDeducciones();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (err) {
                $('#modalNuevaDeduccion').closeModal();
                Materialize.toast("Error al procesar la solicitud",3000,'rounded');
                console.log(err);
            });
    }

    $scope.eliminar = function (id){
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = DeduccionesServicio.delete(id);
            promiseDelete.then(function (pl) {
                    cargarDeducciones();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }

})