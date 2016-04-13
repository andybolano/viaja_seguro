(function() {
    var ActionChannel = pusher.subscribe( 'marcadores' );
    'use strict';

    angular
        .module('app.centrales.mapa')
        .controller('mapaController', mapaController);

    function mapaController($scope, turnosService, authService, socketCh, conductoresService) {

        var vm = this;
        vm.map;
        vm.markers = [];
        vm.markerId = 1;
        vm.contador = 1;
        vm.Markers = [];
        var markersIndex=[];
        socketCh.connect();
        var sessionid = '';

        vm.verConductores = verConductores;
        initialize();

        socketCh.on('connect', function () {
            sessionid = socketCh.sessioniId;
        });

        socketCh.on('updatePos', function (data) {
            updatePos(data);
        });

        $scope.$on("$destroy", function(){
            socketCh.disconnect();
        });

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
                console.log('Error al cargar conductores');
            }
        }

        function verConductores(ruta_id){
            vm.ruta = ruta_id;
            $('#modalMapaConductores').openModal();
            cargarMapa(vm.ruta);
        }

        function updatePos(data){
            if(markersIndex[data.conductor_id] >= 0) {
                vm.markers[markersIndex[data.conductor_id]].latitude = data.lat;
                vm.markers[markersIndex[data.conductor_id]].longitude = data.lng;
            }else{
                conductoresService.get(data.conductor_id).then(succes, error);
                vm.markers.push({
                    "id": data.conductor_id,
                    latitude: data.lat,
                    longitude: data.lng,
                    "window": {
                    },
                    "options" : {
                        "icon": '../assets/images/marker.png',
                        "title":  ''
                    }
                });
                markersIndex[data.conductor_id] = vm.markers.length - 1;
            }
            function succes(c){
                vm.markers[markersIndex[data.conductor_id]].options.itle = c.data.nombres +' '+ c.data.apellidos;
                vm.markers[markersIndex[data.conductor_id]].window = {
                    cImagen: c.data.imagen,
                    cNombres: c.data.nombres,
                    cApellidos: c.data.apellidos,
                    cTelefono: c.data.telefono,
                    cCvehiculo: c.data.vehiculo.codigo_vial
                };
            }
            function error(e){
                console.log('error', e)
            }
        }

        function cargarMapa(){
            vm.markers = [];
            // vm.markersIndex=[];
            vm.map = {
                center: {
                    latitude: authService.currentUser().central.miDireccionLa,
                    longitude: authService.currentUser().central.miDireccionLo
                },
                zoom: 11,
                bounds: {},
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                control: {}
            };
            vm.options = {scrollwheel: false, icon: '../assets/images/marker.png'};
        }

        vm.prueba = function(ruta_id){
            vm.ruta = ruta_id;
            vm.mostrar = true;
            cargarMapa();
            socketCh.emit('changeRuta', ruta_id);
        }

        vm.central = function(){

        }
    }
})();