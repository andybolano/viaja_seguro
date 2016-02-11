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
        cargarPagoPlanillas();
        cargarDeducciones();
    }

    function cargarDeducciones(){
        var promiseGet = serviceEmpresaPagos.getDeducciones();
        promiseGet.then(function (pl) {
            $scope.Deducciones = pl.data;
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