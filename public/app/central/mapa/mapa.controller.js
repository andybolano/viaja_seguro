(function() {
    'use strict';

    angular
        .module('app.centrales.mapa')
        .controller('mapaController', mapaController);

    function mapaController(mapaService, turnosService, authService, $timeout) {
        var vm = this;
        vm.map;
        vm.markers = [];
        vm.markerId = 1;


        //var intval = "";
        vm.verConductores = verConductores;
        initialize();

        function initialize(){
            //vm.ubicaciones = [];
            vm.ruta_id = 0;
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
            vm.ruta = ruta_id;
            console.log(mapaService.getUbicacion(ruta_id));
            $('#modalMapaConductores').openModal();
            $timeout(function(){
                cargarMapa(vm.ruta);
            },5000);
        }

        function cargarMapa(ruta_id){
            vm.ruta = ruta_id;
            vm.map = {
                center: {
                    latitude: authService.currentUser().central.miDireccionLa,
                    longitude: authService.currentUser().central.miDireccionLo
                },
                zoom: 16,
                bounds: {},
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            vm.options = {scrollwheel: false, icon: '../assets/images/marker.png'};

            mapaService.getUbicacionConductores(vm.ruta).then(succes, error);
            function succes(c){
                vm.ubicaciones = c.data;
                vm.contador = 1;
                vm.Markers = [];
                for(var i = 0; i < c.data.length; i++){
                    vm.Markers.push({
                        "id": i,
                        "coords": {
                            latitude: c.data[i].latitud,
                            longitude: c.data[i].longitud
                        },
                        "window": {
                            cImagen: c.data[i].conductor.imagen,
                            cNombres: c.data[i].conductor.nombres,
                            cApellidos: c.data[i].conductor.apellidos,
                            cTelefono: c.data[i].conductor.telefono,
                            cCvehiculo: c.data[i].vehiculo_conductor.codigo_vial,
                        },
                        "options" : {
                            "icon": '../assets/images/marker.png',
                            "title":  c.data[i].conductor.nombres +' '+ c.data[i].conductor.apellidos,
                            "animation": 1
                        },
                    });
                }
            }
            function error(e){
                console.log('error', e)
            }
        }
        //function verConductores(ruta_id){
        //    vm.ruta_id = ruta_id;
        //    $('#modalMapaConductores').openModal({
        //        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        //        opacity: .5, // Opacity of modal background
        //        in_duration: 400, // Transition in duration
        //        out_duration: 300, // Transition out duration
        //        ready: function() {
        //            ubicacionConductores(vm.ruta_id);
        //            intval=window.setInterval(ubicacionConductores,5000);
        //        }, // Callback for Modal open
        //        complete: function() {
        //            if(intval!=""){
        //                window.clearInterval(intval);
        //                intval="";
        //            }
        //        } // Callback for Modal close
        //    });
        //}


        //function ubicacionConductores() {
        //    mapaService.getUbicacionConductores(vm.ruta_id).then(succes, error);
        //    function succes(p) {
        //        vm.ubicaciones = p.data;
        //        var colombia = new google.maps.LatLng(authService.currentUser().central.miDireccionLa, authService.currentUser().central.miDireccionLo);
        //
        //        var opciones = {
        //            zoom: 8,
        //            center: colombia,
        //            mapTypeId: google.maps.MapTypeId.ROADMAP
        //        };
        //        var div = document.getElementById('dvMap');
        //        var map = new google.maps.Map(div, opciones);
        //
        //        var infowindow = new google.maps.InfoWindow({
        //            content: ''
        //        });
        //
        //        $.each(vm.ubicaciones, function (i, obj) {
        //            vm.obj = {};
        //            if(obj.conductor.central_id == authService.currentUser().central.id && obj.conductor.activo == true){
        //
        //                var marcadores = [{
        //                    position: {
        //                        lat: obj.latitud,
        //                        lng: obj.longitud
        //                    },
        //                    contenido : '<div >\
        //                    \<div >\<img src="http://' + (obj.conductor.imagen) + '" title="' + obj.conductor.nombres + '" title="" style="width: 150px;height: 120px;" />\
        //                    \</div>\<div class="contentTxt">\
        //                    \<h2>' + obj.conductor.nombres + '<br>' + obj.conductor.apellidos + '\</h2>\
        //                    \<p>\TELEFONO: ' + obj.conductor.telefono + '\</p>\
        //                    \<p>\CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial + '\</p>\
        //                    \</div>\<div class="clear"></div>\</div>',
                            //title: obj.conductor.nombres + ' ' + obj.conductor.apellidos + ' Movil: ' + obj.vehiculo_conductor.codigo_vial,
        //                }];
        //                for (var i = 0, j = marcadores.length; i < j; i++) {
        //                    var contenido = marcadores[i].contenido;
        //                    var marker = new google.maps.Marker({
        //                        position: new google.maps.LatLng(marcadores[i].position.lat, marcadores[i].position.lng),
        //                        map: map,
        //                        title: marcadores[i].title,
        //                        icon: '../assets/images/marker.png'
        //
        //                    });
        //                    (function (marker, contenido) {
        //                        google.maps.event.addListener(marker, 'click', function () {
        //                            infowindow.setContent(contenido);
        //                            infowindow.open(map, marker);
        //                        });
        //                    })(marker, contenido);
        //                }
        //            }
        //        });
        //    }
        //    function error(error){
        //        console.log('No hay ubicaciones');
        //    }
        //}
    }
})();