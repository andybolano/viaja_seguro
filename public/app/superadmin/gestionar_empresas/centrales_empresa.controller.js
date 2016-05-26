/**
 * Created by tav0 on 12/01/16.
 */

(function () {
    'use strict';

    angular
        .module('app.empresas.actividades')
        .controller('CentralesEmpresaController', CentralesEmpresaController);

    function CentralesEmpresaController(centralesService, empresasService, $stateParams) {
        var vm = this;

        vm.empresa = {};
        vm.selectedCentral = {};
        vm.centrales = [];
        vm.active = "";

        //funciones
        vm.actualizar = actualizar;
        vm.agregarDireccion = agregarDireccion;

        loadCentrales();
        function loadCentrales() {
            empresasService.get($stateParams.id).then(success, error);
            function success(p) {
                vm.empresa = p.data;
                centralesService.getAll(vm.empresa.id).then(success, error);
                function success(p) {
                    vm.centrales = p.data;
                }

                function error(error) {
                    console.log('Error al cargar centrales');
                }
            }

            function error(error) {
                console.log('Error al cargar empresa');
            }
        }

        function actualizar(central) {
            vm.selectedCentral = central;
            vm.editMode = true;
            vm.nombreForm = "Modificar Central";
            vm.active = "active";
            $("#modalNuevaCentral").openModal();
            cargarLocalizacion(central);
        }

        function agregarDireccion() {
            var direccion = vm.selectedCentral.ciudad.nombre + " " + vm.selectedCentral.direccion;
            if (direccion !== '') {
                crearDireccion(direccion, function (marker) {
                    vm.selectedCentral.miDireccionLa = marker.latitude;
                    vm.selectedCentral.miDireccionLo = marker.longitude;
                    // console.log(vm.selectedCentral.miDireccionLo)
                });
            }
        }

        function crearDireccion(direccion) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': direccion}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var firstAddress = results[0];
                    var latitude = firstAddress.geometry.location.lat();
                    var longitude = firstAddress.geometry.location.lng();
                    vm.selectedCentral.miDireccionLa = latitude;
                    vm.selectedCentral.miDireccionLo = longitude;
                    vm.map = {
                        center: new google.maps.LatLng(latitude, longitude),
                        zoom: 15,
                        markers: [],
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var coordenada1 = new google.maps.LatLng(latitude, longitude);
                    var map = new google.maps.Map($("#dvMap")[0], vm.map);
                    var marcador = new google.maps.Marker({
                        position: coordenada1,
                        map: map,
                        animation: 1,
                        title: direccion
                    });
                    return coordenada1;
                } else {
                    alert("Dirección desconocida: " + direccion);
                }
            });
        }

        function cargarLocalizacion(central) {
            vm.map = {
                center: new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo),
                zoom: 15,
                markers: [],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var coordenada1 = new google.maps.LatLng(central.miDireccionLa, central.miDireccionLo);
            var map = new google.maps.Map($("#dvMap")[0], vm.map);
            var marcador = new google.maps.Marker({
                position: coordenada1,
                map: map,
                animation: 1,
                title: "Tu direcion"
            });
        }
    }
})();