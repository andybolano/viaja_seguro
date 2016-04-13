/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.rutas')
        .controller('RutasController', RutasController);

    function RutasController(centralesService, rutasService) {
        var vm = this;
        vm.rutas = [];
        vm.centrales = [];
        vm.ruta = {};
        vm.mostrar = '';
        vm.cont = true;

        //funciones
        vm.nuevo = nuevo;
        vm.guardar = guardar;
        vm.eliminar = eliminar;
        vm.verRuta = verRuta;
        vm.trazarRuta = trazarRuta;

        function nuevo(){
            vm.ruta = {};
            vm.editMode = false;
            loadCentrales();
            ubicacionActual();
            $("#modalRutas").openModal();
            //$('#panel_ruta').hide();
        }

        function verRuta(ruta){
            vm.ruta = ruta;
            vm.editMode = true;
            $("#modalRutas").openModal();
            $('#panel_ruta').show();
            vm.ruta.origen.ciudad.nombre = ruta.origen.ciudad.nombre;
            vm.ruta.origen.direccion = ruta.origen.direccion;
            vm.ruta.destino.ciudad.nombre = ruta.destino.ciudad.nombre;
            vm.ruta.destino.direccion = ruta.destino.direccion;
            vm.trazarRuta();
        }

        function guardar(){
            rutasService.post(vm.ruta).then(success, error);
            function success(p) {
                $("#modalRutas").closeModal();
                loadRutas();
                Materialize.toast('Registro guardado correctamente', 5000);
            }
            function error(error) {
                console.log('Error al guardar');
            }
        }

        function eliminar(id){
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Intentas eliminar esta ruta!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    rutasService.delete(id).then(success, error);
                    swal.disableButtons();
                }
                function success(p) {
                    setTimeout(function() {
                        swal({
                            title: 'Exito!',
                            text: 'Ruta eliminada correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }, function() {
                            loadRutas()
                        })
                    }, 2000);
                }
                function error(error) {
                    swal({
                        title: 'Error!',
                        text: 'No se pudo eliminar la ruta seleccionada',
                        type: 'error',
                        showCancelButton: false,
                    }, function() {
                    })
                }
            });
        }

        loadRutas();
        function loadRutas(){
            rutasService.getAll().then(success, error);
            function success(p) {
                vm.rutas = p.data;
            }
            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function loadCentrales(){
            centralesService.getAll().then(success, error);
            function success(p) {
                vm.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar datos');
            }
        }

        function ubicacionActual() {
            $("#panel_ruta").text("");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

                    vm.mapa = {
                        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        zoom: 15,
                        markers: [],
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    vm.map = new google.maps.Map($("#map_canvas")[0], vm.mapa);

                    //var coordenada1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    //var map = new google.maps.Map($("#dvMap")[0], vm.map);
                    //var marcador = new google.maps.Marker({position: coordenada1,map: vm.map, animation: 1, title:"Tu direcion"});
                });
            } else {
                alert('No se pudo localizar su posicion');
            }
        }

        function trazarRuta(){
            if(!vm.ruta.origen || !vm.ruta.destino) return;
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();
            $('#panel_ruta').show();
            $('#dvMap').show();
            var request = {
                origin: vm.ruta.origen.ciudad.nombre + " , " + vm.ruta.origen.direccion,
                destination: vm.ruta.destino.ciudad.nombre + " , " + vm.ruta.destino.direccion,
                travelMode: google.maps.DirectionsTravelMode['DRIVING'],
                unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
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
})();