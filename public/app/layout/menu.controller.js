(function() {
    'use strict';

    angular
        .module('ViajaSeguro')
        .controller('MenuCtrl', MenuCtrl);

    function MenuCtrl(appMenu, authService) {
        var vm = this;
        var user = authService.currentUser();
        if(user) {
            vm.menu = appMenu.getOf(user.rol);
        }
    }
})();


