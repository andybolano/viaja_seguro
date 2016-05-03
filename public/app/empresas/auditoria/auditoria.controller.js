(function() {
    'use strict';

    angular
        .module('app.empresas.auditoria')
        .controller('auditoriaController', auditoriaController);

    function auditoriaController(centralesService, auditoriaService, $filter, planillasService) {
        var vm = this;
        vm.selectedChanged = selectedChanged;
        vm.producidosFecha = producidosFecha;
        vm.producidosVehiculo = producidosVehiculo;
        vm.producidosTodosVehiculo = producidosTodosVehiculo;
        vm.verPlanilla = verPlanilla;
        vm.imprimir = imprimir;

        initialize();
        function initialize(){
            loadCentrales();
            vm.fechaF = null;
            vm.fechaI = null;
        }

        function loadCentrales(){
            if(!vm.centrales) {
                centralesService.getAll().then(success, error);
            }
            function success(p) {
                vm.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar centrales');
            }
        }

        function selectedChanged(){
            vm.mostra = true;
            vm.producidos_fecha = [];
            vm.todo = false;
        }

        function producidosFecha(fechaI, fechaF){
            vm.fechaI = fechaI;
            vm.fechaF = fechaF;
            var obj = {
                fechaI : vm.fechaI,
                fechaF :vm.fechaF
            };
            // console.log(obj);

            auditoriaService.getProducidosFecha(vm.central.id, obj).then(success, error);
            function success(p){
                vm.total = 0;
                vm.producidos_fecha = [];
                vm.cantidad = p.data.length;
                if(p.data.length <= 0){
                    vm.todo = false;
                    vm.mensaje = 'NO SE REGISTRA ACTIVIDAD PARA LAS FECHAS ESCOGIDAS';
                }else{
                    vm.todo = true;
                    for(var i = 0; i<p.data.length; i++){
                        vm.producidos_fecha.push(p.data[i]);
                        vm.total += p.data[i].total;
                    }
                }
            }
            function error(error){
                console.log('Error al obtener los datos');
            }
        }

        function producidosVehiculo(codigo_vial){

        }

        function producidosTodosVehiculo(){}

        function verPlanilla(planilla){
            planillasService.getPlanilla(planilla.id).then(succes, error);
            function succes(p){
                vm.planilla = {};
                vm.planilla = p.data;
                vm.planilla.total = p.data.total;
                $('#modalPlanilla').openModal();
            }
            function error(e){
                console.log('Error al cargar la planilla', e);
            }
        }

        function imprimir(){
            var ficha = document.getElementById('planilla');
            var ventimp = window.open(' ', 'popimpr');
            ventimp.document.write( ficha.innerHTML );
            ventimp.document.close();
            var css = ventimp.document.createElement("link");
            css.setAttribute("href", "../assets/css/pdf.css");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            ventimp.document.head.appendChild(css);
            ventimp.print( );
            ventimp.close();
        }

        vm.irimpresion = function () {
            // var imgData = "http://"+vm.planilla.central.empresa.logo;
            var doc = new jsPDF('landscape','pt', 'letter');

            doc.setFont("times");
            doc.setFontType("italic");

            doc.internal.scaleFactor = 1.25;

            doc.addHTML(document.getElementById('page-wrap'), 15, 15, {
                pagesplit: true,
                'background': '#fff',
                'heigth': 200
            }, function() {
                doc.addPage();
                doc.addHTML(document.getElementById('giros'), 15, 15, {
                    pagesplit: true,
                    'background': '#fff',
                    'heigth': 200
                }, function () {
                    doc.output("dataurlnewwindow");
                });
            });
        }

    }
})();