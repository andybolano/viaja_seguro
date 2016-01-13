app.controller('PagosController', function ($scope, serviceEmpresaPagos) {
    $scope.Planillas = [];
    $scope.planilla = {};
    $scope.Ahorros = [];
    $scope.Pensiones = [];
    $scope.Seguridad = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;

    cargarPagoAhorro();
    cargarPagoPension();
    cargarPagoPlanillas();
    cargarPagoSeguridad();

    function initialize(){
        $scope.planilla = {
            idConductor: "",
            nombres: ""
        }
    }

    function cargarPagoPlanillas() {
        var promiseGet = serviceEmpresaPagos.getPagoPlanilla();
        promiseGet.then(function (pl) {
            $scope.Planillas = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.nuevoPagoPlanilla = function() {
        $scope.editMode = false;
        $scope.Planilla = {};
        $scope.titulo = "Nueva planilla"
        $("#modalPagarPlanilla").openModal();
    }

    $scope.buscarConductor = function(){
        $scope.titulo = "Formulario de planilla";
        $("#modalBuscarconductor").openModal();
    }

    $scope.selectConductor = function (conductor){
        $scope.Planilla = conductor;
        $scope.Planilla.nombres = conductor.nombres + " " + conductor.apellidos;
        $scope.active = 'active';
        $("#modalBuscarconductor").closeModal();
    }

    function cargarPagoAhorro() {
        var promiseGet = serviceEmpresaPagos.getPagoAhorros();
        promiseGet.then(function (pl) {
            $scope.Ahorros = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function cargarPagoPension() {
        var promiseGet = serviceEmpresaPagos.getPagoPension();
        promiseGet.then(function (pl) {
            $scope.Pensiones = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function cargarPagoSeguridad() {
        var promiseGet = serviceEmpresaPagos.getPagoSeguridad();
        promiseGet.then(function (pl) {
            $scope.Seguridad = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

})