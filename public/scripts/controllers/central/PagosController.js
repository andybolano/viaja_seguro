app.controller('PagosController', function ($scope, serviceEmpresaPagos) {
    $scope.Planillas = [];
    $scope.planilla = {};
    $scope.Ahorros = [];
    $scope.Pensiones = [];
    $scope.Seguridad = [];
    $scope.titulo;
    $scope.active;
    $scope.editMode = false;
    initialize();

    function initialize(){
        $scope.planilla = {}
        cargarPagoAhorro();
        cargarPagoPension();
        cargarPagoPlanillas();
        cargarPagoSeguridad();
        cargarDeducciones();
        cargarConductores();
    }

    function cargarDeducciones(){
        var promiseGet = serviceEmpresaPagos.getDeducciones();
        promiseGet.then(function (pl) {
            $scope.Deducciones = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    function cargarConductores(){
        var promiseGet = serviceEmpresaPagos.getConductores();
        promiseGet.then(function (pl) {
            $scope.Conductores = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
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

    $scope.verPlanilla = function(planilla){
        $scope.Planilla = {};
        serviceEmpresaPagos.getPlanilla(planilla.viaje_id).then(succes, error);
        function succes(p){
            $scope.Planilla = p.data;
            $('#modalPlanilla').openModal();
        }
        function error(){

        }
    }

    $scope.imprimir = function(){
        var printContents = document.getElementById('planilla').innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../public/css/pdf.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }
})