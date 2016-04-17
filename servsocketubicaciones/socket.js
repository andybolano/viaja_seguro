/**
 * Created by tav0 on 23/03/16.
 */
module.exports = function (io) {
    'use strict';
    var monitores = {};
    var clientes_conductores = {};

    io.on('connection', function (socket) {
        console.log('CONNECTED KEY: '+socket.id);

        socket.on("changeRuta", function (id) {
            console.log(socket.id+' change ruta to '+ id);
            monitores[id] = {ruta_id: id, id: socket.id};
        });

        socket.on("loginCliente", function (data) {
            console.log(socket.id+' cliente escuchando '+ data.cliente_id);
            clientes[data.conductor_id] || (clientes[data.conductor_id] = []);
            clientes[data.conductor_id].push({id: socket.id});
        });

        socket.on("posConductor", function (data) {
            var monitor = monitores[data.ruta_id];
            console.log(socket.id+' send pos to:');
            console.log(monitor);
            console.log('\ndata :\n', data);
            if (monitor) {
                io.sockets.soket(monitor.id).emit('updatePos', data);
                var clientes = clientes_conductores[data.conductor_id];
                if (clientes) {
                    for (var i = 0; i < clientes.length; i++) {
                        io.sockets.soket(clientes[i].id).emit('updatePos', data);
                    }
                }
            }
        });

        socket.on("disconnect", function () {
            console.log(socket.id,' disconnected')
        });
    });
}