(function() {
    'use strict';

    angular
        .module('app.centrales.planillas')
        .controller('planillaController', planillaController);

    function planillaController(planillasService, $scope, $compile, $timeout) {
        var vm = this;

        vm.imprimir = imprimir;
        vm.verPlanilla = verPlanilla;

        initialize();
        function initialize(){
            cargarPlanillas();
            cargarDeducciones();
        }

        function cargarPlanillas(){
            planillasService.getPlanillas().then(succes, error);
            function succes(response){
                vm.planillas = {};
                vm.planillas = response.data;
            }
            function error(error){
                console.log('Error al cargar las planillas')
            }
        }

        function cargarDeducciones(){
            var promiseGet = planillasService.getDeducciones();
            promiseGet.then(function (pl) {
                vm.Deducciones = pl.data;
            },function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function verPlanilla(planilla){
            planillasService.getPlanilla(planilla.viaje_id).then(succes, error);
            vm.id = planilla.viaje_id;
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
            var printContents = document.getElementById('page-wrap').innerHTML;
            var popupWin = window.open('', '_blank', '');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" media="print" href="../../../assets/css/pdf.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
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
                'heigth': 500
            }, function() {
                if(document.getElementById('giros')){
                    doc.addPage();
                    doc.addHTML(document.getElementById('giros'), 15, 15, {
                        pagesplit: true,
                        'background': '#fff',
                        'heigth': 500
                    }, function () {
                        if(document.getElementById('paquetes')){
                            doc.addPage();
                            doc.addHTML(document.getElementById('paquetes'), 15, 15, {
                                pagesplit: true,
                                'background': '#fff',
                                'heigth': 500
                            }, function () {
                                doc.output("dataurlnewwindow");
                            });
                        }else{
                            doc.output("dataurlnewwindow");
                        }
                    });
                }else{
                    doc.output("dataurlnewwindow");
                }
            });
        }

        vm.otrai = function () {
            // var getImageFromUrl = function(url, callback) {
            //     var img = new Image();
            //
            //     img.onError = function() {
            //         alert('Cannot load image: "'+url+'"');
            //     };
            //     img.onload = function() {
            //         callback(img);
            //     };
            //     img.setAttribute('crossOrigin', 'anonymous');
            //     img.src = url;
            // }

            var createPDF = function(imgData) {
                var doc = new jsPDF('landscape','pt', 'letter');

                doc.addHTML($('#page-wrap')[0], 15, 15, {
                    'background': '#fff',
                    'heigth': 200
                }, function() {
                    // doc.addImage(imgData, 'PNG', 10, 10, 50, 50, 'monkey'); // Cache the image using the alias 'monkey'
                    var string = doc.output("dataurlnewwindow");
                    $('.preview-pane').attr('src', string);

                });
                doc.output('dataurlnewwindow');
            }

            // getImageFromUrl('http://'+vm.planilla.central.empresa.logo, createPDF);
        }
    }
})();
