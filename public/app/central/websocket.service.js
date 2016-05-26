(function () {
    'use strict';

    angular
        .module('app.centrales', ['ngWebSocket'])
        .service('webSocketService', webSocketService);

    function webSocketService($websocket) {
        this.initialize = function () {
            // Open a WebSocket connection
            var dataStream = $websocket('wss://dev.viajaseguro.con/public/api/conductores');

            var collection = [];

            dataStream.onMessage(function (message) {
                collection.push(JSON.parse(message.data));
            });

            var methods = {
                collection: collection,
                get: function () {
                    dataStream.send(JSON.stringify({action: 'get'}));
                }
            };

            return methods;
        }
    }
})();