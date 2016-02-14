/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('ejemplo')
        .controller('ejemploController', ejemploController);

    function ejemploController() {
        var vm = this;

        vm.data = 'asd';
    }
})();