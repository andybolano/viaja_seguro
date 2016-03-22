var pusher = new Pusher('cabd8ffa68f070ee9742', {
    encrypted: true
});

var itemActionChannel = pusher.subscribe( 'notificaciones' );
(function(){
    'use strict';
    angular
        .module('app.centrales')
        .service('notificacionService', notificacionService);

    function notificacionService(authService){

        this.pusher = function(){
            //Pusher.log = function(message) {
            //    if (window.console && window.console.log) {
            //        window.console.log(message);
            //    }
            //};

            itemActionChannel.bind( "NuevaSolicitudEvent", function( data ) {
                if(authService.currentUser().central.id == data.central_id){
                    Lobibox.notify('info', {
                        size: 'mini',
                        title: 'Nueva solicitud de: ' +data.tipo,
                        msg: data.message,
                        delay: 10000,
                        icon: true,
                        sound: true,
                        soundPath: 'http://dev.vajaseguro/public/assets/plugins/lobibox/dist/sounds/',
                        iconSource: "fontAwesome"
                    });
                }
            } );

            itemActionChannel.bind( "ModificarSolicitudEvent", function( data ) {
                if(authService.currentUser().central.id == data.central_id){
                    Lobibox.notify('info', {
                        size: 'mini',
                        title: 'Nueva notificación de: ' +data.tipo,
                        msg: data.message,
                        delay: 10000,
                        icon: true,
                        sound: true,
                        soundPath: 'http://dev.vajaseguro/public/assets/plugins/lobibox/dist/sounds/',
                        iconSource: "fontAwesome"
                    });
                }
            } );

            itemActionChannel.bind( "CancelarSolicitudEvent", function( data ) {
                if(authService.currentUser().central.id == data.central_id){
                    Lobibox.notify('info', {
                        size: 'mini',
                        title: 'Nueva notificación de: ' +data.tipo,
                        msg: data.message,
                        delay: 10000,
                        icon: true,
                        sound: true,
                        soundPath: 'http://dev.vajaseguro/public/assets/plugins/lobibox/dist/sounds/',
                        iconSource: "fontAwesome"
                    });
                }
            });

            itemActionChannel.bind('UpdatedEstadoConductorEvent', function(data){
                if(authService.currentUser().central.id == data.central_id){
                    Lobibox.notify('info', {
                        size: 'mini',
                        title: 'Nueva: ' +data.tipo,
                        msg: data.message,
                        delay: 10000,
                        icon: true,
                        sound: true,
                        soundPath: 'http://dev.vajaseguro/public/assets/plugins/lobibox/dist/sounds/',
                        iconSource: "fontAwesome"
                    });
                }
            });
        }
    }
})();