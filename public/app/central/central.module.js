(function() {
    'use strict';

    angular
        .module('app.centrales', [
            'app.centrales.conductores',
            'app.centrales.mapa',
            'app.centrales.turnos',
            'app.centrales.planillas'
        ]);
})();