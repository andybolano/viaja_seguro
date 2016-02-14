var cont=true;
function initialize() {
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(10.46517162079649,-73.25546264648438),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var mapa = new google.maps.Map(document.getElementById("mapa"), mapOptions);
    google.maps.event.addListener(mapa, "click", function(evento) {
        var latitud = evento.latLng.lat();
        var longitud = evento.latLng.lng();
        console.log(latitud, longitud);

        if(cont == true){
            var coordenada1 = new google.maps.LatLng(latitud, longitud);
            var marcador = new google.maps.Marker({position: coordenada1,map: mapa, animation: google.maps.Animation.DROP, title:"Punto A"});
            cont = false;
        }else {
            return;
        }

    }); //Fin del evento
}
function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?&sensor=TRUE_OR_FALSE&callback=initialize";
    document.body.appendChild(script);

}

//window.onload = loadScript;

$(document).ready(function() {



    //
    //$('#localizar').on('click', function (e) {
    //    e.preventDefault();
    //    registrarPosicion();
    //});
});