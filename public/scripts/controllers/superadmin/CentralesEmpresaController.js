/**
 * Created by tav0 on 12/01/16.
 */
app.controller('CentralesEmpresaController', CentralesEmpresaController);

function CentralesEmpresaController($scope, centralesService, empresasService, $routeParams){

    $scope.empresa = {};
    $scope.selectedCentral = {};
    $scope.centrales = [];
    $scope.active = "";

    //funciones
    $scope.actualizar = actualizar;

    loadCentrales();
    function loadCentrales(){
        empresasService.get($routeParams.id).then(success, error);
        function success(p) {
            $scope.empresa = p.data;
            centralesService.getAll($scope.empresa.id).then(success, error);
            function success(p) {
                $scope.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar centrales', error);
            }
        }
        function error(error) {
            console.log('Error al cargar empresa', error);
        }
    }

    function actualizar(central){
        $scope.selectedCentral = central;
        $scope.editMode = true;
        $scope.nombreForm = "Modificar Central";
        $scope.active = "active";
        $("#modalNuevaCentral").openModal();
        cargarLocalizacion(central);
    }

    $scope.agregarDireccion = function() {
        var direccion = $scope.selectedCentral.ciudad.nombre + " " + $scope.selectedCentral.direccion;
        if (direccion !== '') {
            crearDireccion(direccion, function(marker) {
                $scope.selectedCentral.miDireccionLa = marker.latitude;
                $scope.selectedCentral.miDireccionLo = marker.longitude;
                console.log($scope.selectedCentral.miDireccionLo)
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
                $scope.selectedCentral.miDireccionLa = latitude;
                $scope.selectedCentral.miDireccionLo = longitude;
                $scope.map = {
                    center: new google.maps.LatLng(latitude, longitude),
                    zoom: 15,
                    markers: [],
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                var coordenada1 = new google.maps.LatLng(latitude, longitude);
                var map = new google.maps.Map($("#dvMap")[0], $scope.map);
                var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:direccion});
                return coordenada1;
            } else {
                alert("Dirección desconocida: " + direccion);
            }
        });
    }

    function cargarLocalizacion(central){
        $scope.map = {
            center: new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo),
            zoom: 15,
            markers: [],
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var coordenada1 = new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo);
        var map = new google.maps.Map($("#dvMap")[0], $scope.map);
        var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:"Tu direcion"});
    }

}