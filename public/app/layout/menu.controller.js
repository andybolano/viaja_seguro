(function() {
    'use strict';

    angular
        .module('ViajaSeguro')
        .controller('MenuCtrl', MenuCtrl);

    function MenuCtrl(appMenu, authService) {
        var vm = this;
        vm.menu = appMenu.getOf(authService.currentUser().rol);
    }
})();


