app.controller('ClientesController', function ($scope, ClienteServicio) {
    $scope.Clientes = [];
    $scope.cliente = {};
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    cargarClientes();

    function initialize(){
        $scope.cliente = {
            id: "",
            nomnbres: ""
        }
    }


    function cargarClientes() {
        var promiseGet = ClienteServicio.getAll();
        promiseGet.then(function (pl) {
            $scope.Clientes = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoCliente = function  () {
        $scope.editMode = false;
        $scope.active = "";
        $scope.Cliente = {};
        $scope.titulo = "Crear Cliente"
        $("#modalNuevoCliente").openModal();
    }

    $scope.guardar = function  () {
        var object = {
            identificacion : $scope.Cliente.identificacion,
            nombres : $scope.Cliente.nombres,
            apellidos : $scope.Cliente.apellidos,
            telefono : $scope.Cliente.telefono,
            direccion : $scope.Cliente.direccion,
            fechaNac: $scope.Cliente.fechaNac
        };
        console.log(object);
        var promisePost = ClienteServicio.post(object);
        promisePost.then(function (pl) {
                $("#modalNuevoCliente").closeModal();
                cargarClientes();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.modificar = function  (cliente) {
        $scope.editMode = true;
        $scope.titulo = "Modificar cliente"
        $scope.active = "active";
        $scope.Cliente = cliente
        $scope.Cliente.fechaNac = new Date(cliente.fechaNac);

        $("#modalNuevoCliente").openModal();
    };

    $scope.update = function  () {
        var object = {
            identificacion : $scope.Cliente.identificacion,
            nombres : $scope.Cliente.nombres,
            apellidos : $scope.Cliente.apellidos,
            telefono : $scope.Cliente.telefono,
            direccion : $scope.Cliente.direccion,
            fechaNac: $scope.Cliente.fechaNac
        };
        console.log(object);
        var promisePut = ClienteServicio.put(object,$scope.Cliente.identificacion);
        promisePut.then(function (pl) {
                $("#modalNuevoCliente").closeModal();
                cargarClientes();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            },
            function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
    }

    $scope.eliminar = function (id){
        if(confirm('¿Deseas eliminar el registro?') == true) {
            var promiseDelete = ClienteServicio.delete(id);
            promiseDelete.then(function (pl) {
                    cargarClientes();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('No se pudo eliminar el registro', errorPl);
                });
        }
    }
})