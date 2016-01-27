/**
 * Created by tav0 on 12/01/16.
 */
app.controller('RutasController', RutasController);

function RutasController($scope, centralesService, rutasService){

    $scope.rutas = [];
    $scope.centrales = [];
    $scope.ruta = {};
    $scope.mostrar = '';
    $scope.cont = true;

    //funciones
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.eliminar = eliminar;
    $scope.verRuta = verRuta;

    function nuevo(){
        $scope.ruta = {};
        $scope.mostrar = 'false';
        loadCentrales();
        $("#modalRutas").openModal();
        $("#mapa").text("");

    }

    function verRuta(ruta){
        $scope.ruta = ruta;
        $scope.mostrar = 'true';
        $("#modalRutas").openModal();
        $scope.ruta.origen.ciudad.nombre = ruta.origen.ciudad.nombre;
        $scope.ruta.origen.direccion = ruta.origen.direccion;
        $scope.ruta.destino.ciudad.nombre = ruta.destino.ciudad.nombre;
        $scope.ruta.destino.direccion = ruta.destino.direccion;
        $scope.trazarRuta();
    }

    function guardar(){
        rutasService.post($scope.ruta).then(success, error);
        function success(p) {
            $("#modalRutas").closeModal();
            loadRutas();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
        }
    }

    function eliminar(id){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            rutasService.delete(id).then(success, error);
        }
        function success(p) {
            Materialize.toast('Registro eliminado', 5000);
            loadRutas()
        }
        function error(error) {
            console.log('Error al eliminar', error);
        }
    }

    loadRutas();
    function loadRutas(){
        rutasService.getAll().then(success, error);
        function success(p) {
            $scope.rutas = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    function loadCentrales(){
        centralesService.getAll().then(success, error);
        function success(p) {
            $scope.centrales = p.data;
        }
        function error(error) {
            console.log('Error al cargar datos', error);
        }
    }

    $scope.agregarDireccionO = function() {
        var direccion = $scope.ruta.origen.ciudad.nombre + " , " + $scope.ruta.origen.direccion;
        $scope.cont = true;
        console.log(direccion)
        if (direccion !== '') {
            crearDireccion(direccion, function(marker) {
                $scope.ruta.laOrigen = marker.latitude;
                $scope.ruta.loOrigen = marker.longitude;
                console.log($scope.ruta.laOrigen)
            });
        }
    };

    $scope.agregarDireccionD = function() {
        $scope.cont = false;
        var direccion = $scope.ruta.destino.ciudad.nombre + " , " + $scope.ruta.destino.direccion;
        if (direccion !== '') {
            crearDireccion(direccion, function(marker) {
                $scope.ruta.laDestino = marker.latitude;
                $scope.ruta.loDestino = marker.longitude;
            });
        }
    };

    function crearDireccion(direccion) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : direccion}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var firstAddress = results[0];
                var latitude = firstAddress.geometry.location.lat();
                var longitude = firstAddress.geometry.location.lng();
                $scope.mapa = {
                    center: new google.maps.LatLng(latitude, longitude),
                    zoom: 15,
                    markers: [],
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                $scope.map = new google.maps.Map($("#dvMap")[0], $scope.mapa);

                if($scope.cont == true){
                    $scope.coordenada1 = new google.maps.LatLng(latitude, longitude);
                    var marcador = new google.maps.Marker({position: $scope.coordenada1,map: $scope.map, animation: 1, title:"Central Origen", icon: '../../public/images/marker.png'});
                }else{
                    $scope.coordenada2 = new google.maps.LatLng(latitude, longitude);
                    var marcador = new google.maps.Marker({position: $scope.coordenada2,map: $scope.map, animation: 1, title:"Central Destino", icon: '../../public/images/marker.png'});
                    trazarLinea();
                }
            } else {
                alert("Dirección desconocida: " + direccion);
            }
        });
    }

    function trazarLinea(){
        var cor1 = $scope.coordenada1;
        var cor2 = $scope.coordenada2;
        console.log($scope.coordenada1.latitude)
        var lineas = new google.maps.Polyline({
            path: [cor1,cor2],
            map: $scope.map,
            strokeColor: '#222000',
            strokeWeight: 4,
            strokeOpacity: 0.6,
            clickable: false     });

        //var polyline = new google.maps.Polyline([cor1,cor2], "#0000dd", 6, 0.4);
        //google.maps.addOverlay(polyline);
    }

    $scope.trazarRuta = function(){
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();

        var request = {
            origin: $scope.ruta.origen.ciudad.nombre + " , " + $scope.ruta.origen.direccion,
            destination: $scope.ruta.destino.ciudad.nombre + " , " + $scope.ruta.destino.direccion,
            travelMode: google.maps.DirectionsTravelMode[$('#modo_viaje').val()],
            unitSystem: google.maps.DirectionsUnitSystem[$('#tipo_sistema').val()],
            provideRouteAlternatives: true
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var map = new google.maps.Map($("#map_canvas")[0], request);
                directionsDisplay.setMap(map);
                var marker = new google.maps.Marker({
                    map: map,
                    title:"Esto es un marcador",
                    animation: 1,
                    icon: '../../public/images/marker.png'
                });
                $("#panel_ruta").text("");

                directionsDisplay.setPanel($("#panel_ruta").get(0));
                directionsDisplay.setDirections(response);
            } else {
                alert("No existen rutas entre ambos puntos");
            }
        });
    }

}
