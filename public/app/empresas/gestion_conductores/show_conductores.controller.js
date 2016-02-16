/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .controller('ConductorController', ConductorController);

    function ConductorController(conductoresEmpresaService, centralesService) {
        var vm = this;
        vm.Conductores = [];
        vm.ConductoresInactivos = [];
        vm.activos = true;
        vm.mode = 'new';

        vm.nuevoConductor = nuevoConductor;
        vm.modificar = modificar;

        cargarConductores();

        function nuevoConductor(){
            vm.mode = 'new';
            vm.active = "";
            vm.titulo = "Registrar Conductor";
            vm.Conductor = {};
            loadCentrales();
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" ng-src="http://',vm.Conductor.imagen,'" title="imagen" alt="seleccione foto"/>'].join('');
            $("#modalNuevoConductor").openModal();
        }

        function modificar(conductor) {
            vm.mode = 'edit';
            vm.titulo = "Modificar conductor"
            vm.active = "active";
            vm.Conductor = conductor;
            $("#modalNuevoConductor").openModal();
        };
        function cargarConductores() {
            var promiseGet = conductoresEmpresaService.getAll();
            promiseGet.then(function (p) {
                for(var i=0; i<p.data.length; i++){
                    if(p.data[i].activo == true ){
                        vm.Conductores.push(p.data[i]);
                    }else{
                        vm.ConductoresInactivos.push(p.data[i]);
                    }
                }
            },function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function loadCentrales(){
            if(!vm.centrales) {
                centralesService.getAll().then(success, error);
            }
            function success(p) {
                vm.centrales = p.data;
            }
            function error(error) {
                console.log('Error al cargar centrales', error);
            }
        }
    }
})();