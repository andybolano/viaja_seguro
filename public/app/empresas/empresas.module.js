(function() {
    'use strict';

    angular
        .module('app.empresas', [
            'app.empresas.conductores',
            'app.empresas.centrales'
            //modules
            'app.empresas.conductores',
            'app.empresas.deducciones',
            'app.empresas.vehiculos',
            //libs
            'google-maps'
        ]);
})();