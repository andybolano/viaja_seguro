/**
 * Created by tav0 on 23/03/16.
 */

(function() {
    'use strict';

    angular
        .module('commons')
        .factory('socketCh', socket);

    function socket($rootScope) {
        var socket;
        var sessionId = '';
        var service = {
            connect: connect,
            disconnect: disconnect,
            on: on,
            emit: emit,
            sessionId: sessionId
        };
        return service;

        function connect() {
            socket = io.connect('http://dev.viajaseguro.co:8070')
            sessionId = socket.io.engine.id;
        }

        function disconnect() {
            socket.disconnect();
        }

        function on(event, callback) {
            if (socket) {
                socket.on(event, function(data) {
                    $rootScope.$apply(function () {
                        callback(data);
                    });
                });
            }
        };

        function emit(event, data) {
            if (socket) {
                socket.emit(event, data);
            }
        };
    }
})();