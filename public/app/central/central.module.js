(function() {
    'use strict';

    angular
        .module('app.centrales', [
            //modulos
            'app.centrales.conductores',
            'app.centrales.mapa',
            'app.centrales.turnos',
            'app.centrales.planillas',
            //libs
            'dndLists'
        ]);
})();