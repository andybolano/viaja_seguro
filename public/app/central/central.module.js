(function() {
    'use strict';

    angular
        .module('app.centrales', [
            //modulos
            'app.centrales.turnos',
            'app.centrales.conductores',
            'app.centrales.mapa',
            'app.centrales.planillas',
            'app.centrales.notificaciones',
            //libs
            'dndLists'
        ]);
})();