(function() {
    'use strict';

    angular
        .module('app.empresas', [
            //modules
            'app.empresas.conductores',
            'app.empresas.deducciones',
            //libs
            'google-maps'
        ]);
})();