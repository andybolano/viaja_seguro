(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .controller('mapaController', mapaController);

    function mapaController(mapaService, turnosService, authService) {
        var vm = this;

        vm.verConductores = verConductores;
        initialize();

        function initialize(){
            //vm.ubicaciones = [];
            cargarRutas();
        }

        function cargarRutas() {
            turnosService.getRutasCentral().then(success, error);
            function success(p) {
                vm.rutas = p.data;
            }
            function error(error) {
                console.log('Error al cargar conductores', error);
            }
        }

        function verConductores(ruta_id){
            vm.ruta_id = ruta_id;
            $('#modalMapaConductores').openModal();
            ubicacionConductores(vm.ruta_id);
        }

        function ubicacionConductores(ruta_id) {
            mapaService.getUbicacionConductores(ruta_id).then(succes, error);
            function succes(p) {
                vm.ubicaciones = p.data;
                var colombia = new google.maps.LatLng(authService.currentUser().central.miDireccionLa, authService.currentUser().central.miDireccionLo);

                var opciones = {
                    zoom: 8,
                    center: colombia,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var div = document.getElementById('dvMap');
                var map = new google.maps.Map(div, opciones);

                var infowindow = new google.maps.InfoWindow({
                    content: ''
                });

                $.each(vm.ubicaciones, function (i, obj) {
                    vm.obj = {};
                    if(obj.conductor.central_id == authService.currentUser().central.id && obj.conductor.activo == true){

                        var marcadores = [{
                            position: {
                                lat: obj.latitud,
                                lng: obj.longitud
                            },
                            contenido : '<div >\
                            \<div >\<img src="http://' + (obj.conductor.imagen) + '" title="' + obj.conductor.nombres + '" title="" style="width: 150px;height: 120px;" />\
                            \</div>\<div class="contentTxt">\
                            \<h2>' + obj.conductor.nombres + '<br>' + obj.conductor.apellidos + '\</h2>\
                            \<p>\TELEFONO: ' + obj.conductor.telefono + '\</p>\
                            \<p>\CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial + '\</p>\
                            \</div>\<div class="clear"></div>\</div>',
                            title: obj.conductor.nombres + ' ' + obj.conductor.apellidos + ' Movil: ' + obj.vehiculo_conductor.codigo_vial,
                        }];
                        for (var i = 0, j = marcadores.length; i < j; i++) {
                            var contenido = marcadores[i].contenido;
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(marcadores[i].position.lat, marcadores[i].position.lng),
                                map: map,
                                title: marcadores[i].title,
                                icon: '../assets/images/marker.png'

                            });
                            (function (marker, contenido) {
                                google.maps.event.addListener(marker, 'click', function () {
                                    infowindow.setContent(contenido);
                                    infowindow.open(map, marker);
                                });
                            })(marker, contenido);
                        }
                    }
                });
            }
            function error(error){
                console.log('No hay ubicaciones');
            }
        }
    }
})();