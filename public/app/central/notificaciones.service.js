(function(){
    'use strict';

    angular
        .module('app.centrales')
        .service('notificacionesDesktopService', notificacionesDesktopService );

    function notificacionesDesktopService(){
        if(Notification.permission!=="granted") {
            Notification.requestPermission();
        }

        this.onSolicitudRecived = function(data){
            var options = {
                icon: 'http://dev.viajaseguro.co/public/assets/images/icono.png',
                body: data.message,
                sound: 'http://dev.viajaseguro.co/public/assets/sounds/noty.mp3'
            }
            if (!isNotificationSupported()) {
                logg("Tu navegador no soporta Notificaciones. Por favor, utiliza una versión Reciente del Navegador Google Chrome o Safari.");
                return;
            }
            // Si el Navegador soporta las Notificaciones HTML 5, entonces que proceda a Notificar
            var notificacion = new Notification('Nueva notificación de: ' +data.tipo, options);
            var audio = new Audio('http://dev.viajaseguro.co/public/assets/sounds/noty.mp3');
            audio.play();
            setTimeout(notificacion.close.bind(notificacion), 10000);

            // Redireccionamos a un determinado Destino o URL al hacer click en la Notificación
            notificacion.onclick = function() {
                window.open("http://dev.viajaseguro.co/public/app/#/centrales/turnos");
            };
        }

        this.onNotificationRecived = function(data) {
            var options = {
                icon: 'http://'+data.conductor.imagen,
                body: data.message,
                sound: 'http://dev.viajaseguro.co/public/assets/sounds/noty.mp3'
            }
            if (!isNotificationSupported()) {
                logg("Tu navegador no soporta Notificaciones. Por favor, utiliza una versión Reciente del Navegador Google Chrome o Safari.");
                return;
            }
            // Si el Navegador soporta las Notificaciones HTML 5, entonces que proceda a Notificar
            var notificacion = new Notification('Nueva: ' +data.tipo, options);
            var audio = new Audio('http://dev.viajaseguro.co/public/assets/sounds/noty.mp3');
            audio.play();
            setTimeout(notificacion.close.bind(notificacion), 10000);
            // Redireccionamos a un determinado Destino o URL al hacer click en la Notificación
            notificacion.onclick = function() {
                window.open("http://dev.viajaseguro.co/public/app/#/centrales/turnos");
            };
        }

// Solicitamos los Permisos del Sistema
        function requestPermissions() {

        }

// Luego del Permiso del Sistema, le indicamos que nos Muestre la Notificación
        function isNotificationSupported() {
            return ("Notification" in window);
        }

// Mostramos el Mensaje de la Notificación
        function logg(mensaje) {
            notificador.innerHTML += "<p>"+mensaje+"</p>";
        }
    }
})();