app.controller('ubicacionesController', function ($scope, turnosService, ubicacionesService, authService) {
    $scope.verConductores = verConductores;
    cargarRutas();

    function cargarRutas() {
        turnosService.getRutasCentral().then(success, error);
        function success(p) {
            $scope.rutas = p.data;
        }

        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }

    function verConductores(ruta_id){
        $scope.ruta_id = ruta_id;
        $('#modalMapaConductores').openModal();
        ubicacionConductores($scope.ruta_id);
    }


    function ubicacionConductores(ruta_id) {
        ubicacionesService.getUbicacionConductores(ruta_id).then(succes, error);
        function succes(p){
            $scope.ubicaciones = p.data;
            var colombia = new google.maps.LatLng(authService.currentUser().central.miDireccionLa,authService.currentUser().central.miDireccionLo);

            var opciones = {
                zoom:8,
                center:colombia,
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            var div = document.getElementById('dvMap');
            var map = new google.maps.Map(div,opciones);
            var marcadores = [];

            $.each($scope.ubicaciones,function(i,obj){
                $scope.obj= {};
                //var imagen = {
                //    url: obj.conductor.imagen,
                //    size: new google.maps.Size(80, 80),
                //    origin: new google.maps.Point(0, 0),
                //    anchor: new google.maps.Point(17, 34),
                //    scaledSize: new google.maps.Size(25, 25)
                //};
                //$scope.obj.imagen = obj.conductor.imagen;
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
                    if (datos[i][1] =='undefined'){ description ='';} else { description = datos[i][1];}
                    if (datos[i][2] =='undefined'){ telephone ='';} else { telephone = datos[i][2];}
                    if (datos[i][3] =='undefined'){ email ='';} else { email = datos[i][3];}
                    if (datos[i][4] =='undefined'){ web ='';} else { web = datos[i][4];}
                    if (datos[i][7] =='undefined'){ markericon ='';} else { markericon = datos[i][7];}
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
                \<div >\<img src="'+ (obj.conductor.imagen)+'" title="'+obj.conductor.nombres+'" title="" style="width: 150px;height: 120px;" />\
                \</div>\<div class="contentTxt">\
                \<h2>'+obj.conductor.nombres+' ' + obj.conductor.apellidos+'\</h2>\
                \<p>\TELEFONO: ' + obj.conductor.telefono+'\</p>\
                \<p>\CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial+'\</p>\
                \</div>\<div class="clear"></div>\</div>';
                }

                    var infowindow = new google.maps.InfoWindow({
                        content: contenido
                    });
                    google.maps.event.addListener(marker, 'click', function(){
                        infowindow.open(map, marker);
                    });




                //var marcador=new google.maps.Marker({
                //    title: obj.conductor.nombres +' '+ obj.conductor.apellidos,
                //    position:new google.maps.LatLng(obj.latitud,obj.longitud),
                //    map:map,
                //});
                //marcadores.push(marker);
            });
        }
        function error(error){
            console.log('No hay ubicaciones');
        }
    }
});