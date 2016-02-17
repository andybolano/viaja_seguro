(function() {
    'use strict';

    angular
        .module('app.empresas', [
            //modules
            'app.empresas.conductores',
            'app.empresas.deducciones',
            'app.empresas.vehiculos',
            //libs
            'google-maps'
        ]);
})();