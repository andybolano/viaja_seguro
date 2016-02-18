(function() {
    'use strict';

    angular
        .module('app.empresas', [
            'app.empresas.conductores',
            'app.empresas.centrales',
            'app.empresas.conductores',
            'app.empresas.deducciones',
            'app.empresas.vehiculos',
            'app.empresas.rutas',
            //libs
            'google-maps'
        ]);
})();