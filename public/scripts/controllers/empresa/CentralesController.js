/**
 * Created by tav0 on 12/01/16.
 */
app.controller('CentralesController', CentralesController);

function CentralesController($scope, centralesService, ciudadesService, authService){

    $scope.selectedCentral = {};
    $scope.centrales = [];
    $scope.servicios = [];
    $scope.ciudades = [];
    $scope.editMode = false;
    $scope.nombreForm = "";
    $scope.active = "";

    //funciones
    $scope.nuevo = nuevo;
    $scope.guardar = guardar;
    $scope.actualizar = actualizar;
    $scope.update = update;
    $scope.eliminar = eliminar;

    $scope.openCiudades = openCiudades;
    $scope.selecionarCiudad = selecionarCiudad;

    $scope.generarDatosAcceso = generarDatosAcceso;

    init();
    function init(){
        $scope.selectedCentral = {};
        $scope.centrales = [];
        loadCentrales();
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

    function nuevo(){
        $scope.selectedCentral = {};
        $scope.selectedCentral.usuario = {};
        $scope.nombreForm = "Nueva Central";
        $scope.active = "";
        $scope.editMode = false;
        $scope.fileimage = null;
        $("#modalNuevaCentral").openModal();
        ubicacionActual();
    }

    function guardar(){
        centralesService.post($scope.selectedCentral).then(success, error);
        function success(p) {

            $("#modalNuevaCentral").closeModal();
            $scope.selectedCentral = p.data;
            $scope.centrales.push($scope.selectedCentral);
            init();
            Materialize.toast('Registro guardado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al guardar', error);
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

    function update(){
        console.log($scope.selectedCentral)
        centralesService.put($scope.selectedCentral, $scope.selectedCentral.id).then(success, error);
        function success(p) {
            $("#modalNuevaCentral").closeModal();
            $scope.editMode = false;
            init();
            Materialize.toast('Registro modificado correctamente', 5000);
        }
        function error(error) {
            console.log('Error al actualizar', error);
        }
    }

    function eliminar(id){
        if(confirm('¿Deseas eliminar el registro?') ==true) {
            centralesService.delete(id).then(success, error);
        }
        function success(p) {
            init();
            Materialize.toast('Registro eliminado', 5000);
        }
        function error(error) {
            console.log('Error al eliminar', error);
        }
    }

    function selecionarCiudad(ciudad){
        $scope.selectedCentral.ciudad = ciudad;
        $("#modalSeleccionarCiudad").closeModal();
    }

    function openCiudades(){
        if(!$scope.editMode) {
            loadCiudades();
            $("#modalSeleccionarCiudad").openModal();
        }
    }

    function loadCiudades(){
        ciudadesService.getAll().then(success, error);
        function success(p) {
            $scope.ciudades = p.data;
        }
        function error(error) {
            console.log('Error al cargar la ciudades', error);
        }
    }

    function generarDatosAcceso(){
        $scope.selectedCentral.usuario.nombre = (
            authService.currentUser().empresa.nombre.toLowerCase()+
            '_'+$scope.selectedCentral.ciudad.nombre.toLowerCase()+
            '_'+Math.floor((Math.random() * (999 - 101 + 1)) + 101)).replace(/\s+/g, '');
        $scope.selectedCentral.usuario.contrasena = $scope.selectedCentral.usuario.nombre;
    }

    function ubicacionActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.selectedCentral.miDireccionLa = position.coords.latitude;
                $scope.selectedCentral.miDireccionLo = position.coords.longitude;
                $scope.map = {
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    zoom: 15,
                    markers: [],
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                var coordenada1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var map = new google.maps.Map($("#dvMap")[0], $scope.map);
                var marcador = new google.maps.Marker({position: coordenada1,map: map, animation: 1, title:"Tu direcion"});
            });
        } else {
            alert('No se pudo localizar si posicion');
        }
    }

    $scope.agregarDireccion = function() {
        var direccion = $scope.selectedCentral.direccion;
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