
app.controller('MapCtrl', ['MarkerCreatorService', '$scope', function (MarkerCreatorService, $scope) {

    MarkerCreatorService.crearPunto(10.46517162079649, -73.25546264648438, function (marker) {
        marker.options.labelContent = 'Valledupar';
        $scope.autentiaMarker = marker;
    });

    $scope.selectedCentral.direccion = '';

    $scope.cargarMapa = function(){
        var marker = {};
        marker.la = $scope.selectedCentral.miDireccionLa;
        marker.lo = $scope.selectedCentral.miDireccionLo;
        MarkerCreatorService.cargarMapa(function(marker){

        });
    }

    $scope.map = {
        center: {
            latitude: $scope.autentiaMarker.latitude,
            longitude: $scope.autentiaMarker.longitude
        },
        zoom: 15,
        markers: [],
        control: {},
        options: {
            scrollwheel: true
        }
    };
    $scope.map.markers.push($scope.autentiaMarker);

    $scope.agregarUbicacionActual = function () {
        MarkerCreatorService.ubicacionActual(function (marker) {
            marker.options.labelContent = 'Estas aqui !';
            $scope.selectedCentral.miDireccionLa = marker.latitude;
            $scope.selectedCentral.miDireccionLo = marker.longitude;
            $scope.map.markers.push(marker);
            refresh(marker);
        });
    };

    $scope.agregarDireccion = function() {
        var direccion = $scope.selectedCentral.direccion;
        if (direccion !== '') {
            MarkerCreatorService.crearDireccion(direccion, function(marker) {
                $scope.selectedCentral.miDireccionLa = marker.latitude;
                $scope.selectedCentral.miDireccionLo = marker.longitude;
                $scope.map.markers.push(marker);
                refresh(marker);
            });
        }
    };

    $scope.limpiar = function(){

    }

    function refresh(marker) {
        $scope.map.control.refresh({latitude: marker.latitude,
            longitude: marker.longitude});
    }

}]);