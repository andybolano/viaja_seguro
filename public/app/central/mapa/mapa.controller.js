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
            function succes(p){
                vm.ubicaciones = p.data;
                var colombia = new google.maps.LatLng(authService.currentUser().central.miDireccionLa,authService.currentUser().central.miDireccionLo);
                var opciones = {
                    zoom:8,
                    center:colombia,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                };
                var div = document.getElementById('dvMap');
                var map = new google.maps.Map(div,opciones);

                $.each(vm.ubicaciones,function(i,obj){
                    vm.obj= {};
                    var datos = [
                        [
                            obj.conductor.nombres +' ' + obj.conductor.apellidos + ' CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial,
                            'Conductor en ruta',
                            obj.conductor.telefono,
                            obj.conductor.imagen,
                            'undefined',
                            obj.latitud,
                            obj.longitud,
                            uri +'/images/marker.png'
                        ]
                    ];

                    for (i = 0; i < datos.length; i++) {
                        if (datos[i][1] =='undefined'){ var description ='';} else { description = datos[i][1];}
                        if (datos[i][2] =='undefined'){ var telephone ='';} else { telephone = datos[i][2];}
                        if (datos[i][3] =='undefined'){ var email ='';} else { email = datos[i][3];}
                        if (datos[i][4] =='undefined'){ var web ='';} else { web = datos[i][4];}
                        if (datos[i][7] =='undefined'){ var markericon ='';} else { markericon = datos[i][7];}
                        marker = new google.maps.Marker({
                            icon: markericon,
                            position: new google.maps.LatLng(datos[i][5], datos[i][6]),
                            map: map,
                            title: datos[i][0],
                            desc: description,
                            img: telephone,
                            email: email,
                            web: web
                        });

                        var contenido = '<div >\
                            \<div >\<img src="http://'+ (obj.conductor.imagen)+'" title="'+obj.conductor.nombres+'" title="" style="width: 150px;height: 120px;" />\
                            \</div>\<div class="contentTxt">\
                            \<h2>'+obj.conductor.nombres+' ' + obj.conductor.apellidos+'\</h2>\
                            \<p>\TELEFONO: ' + obj.conductor.telefono+'\</p>\
                            \<p>\CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial+'\</p>\
                            \</div>\<div class="clear"></div>\</div>';

                        var infowindow = new google.maps.InfoWindow({
                            content: contenido
                        });
                    }

                    google.maps.event.addListener(marker, 'click', function(){
                        infowindow.open(map, marker);
                    });
                });
            }
            function error(error){
                console.log('No hay ubicaciones', error);
            }
        }

    }
})();