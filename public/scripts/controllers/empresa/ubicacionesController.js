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
                //var imagen = {
                //    url: obj.conductor.imagen,
                //    size: new google.maps.Size(80, 80),
                //    origin: new google.maps.Point(0, 0),
                //    anchor: new google.maps.Point(17, 34),
                //    scaledSize: new google.maps.Size(25, 25)
                //};
                var datos = [
                    [
                        obj.conductor.nombres +' ' + obj.conductor.apellidos + ' CODIGO VIAL: ' + obj.vehiculo_conductor.codigo_vial,
                        'Conductor en ruta',
                        obj.conductor.telefono,
                        'undefined',
                        'undefined',
                        obj.latitud,
                        obj.longitud,
                        uri +'`/images/marker.png'
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
                        tel: telephone,
                        email: email,
                        web: web
                    });
                }

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