(function () {
    'use strict';

    angular
        .module('app.empresas.deducciones')
        .controller('valoresDeduccionesController', valoresDeduccionesController);

    function valoresDeduccionesController(deduccionesService, centralesService) {
        var vm = this;
        vm.titulo;
        vm.active;
        vm.editMode = false;
        vm.central;
        initialize();

        vm.guardar = guardar;
        vm.cargarValoresDeducciones = cargarValoresDeducciones;

        loadCentrales();

        function initialize() {
            vm.Deduccion = {}
            cargarDeducciones();
        }

        function cargarValoresDeducciones(central) {
            var promiseGet = deduccionesService.getByCentral(central.id);
            promiseGet.then(function (pl) {
                setValores(pl.data);
            }, function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function setValores(deducciones) {
            vm.valores_deducciones = [];
              vm.Deducciones.forEach(function (deduccion) {
                  var valores = deducciones.find(function (d) {return (d.deduccion_id == deduccion.id)})
                  deduccion.valor_lunes = valores ? parseFloat(valores.valor_lunes) : 0;
                  deduccion.valor_martes = valores ? parseFloat(valores.valor_martes) : 0;
                  deduccion.valor_miercoles = valores ? parseFloat(valores.valor_miercoles) : 0;
                  deduccion.valor_jueves = valores ? parseFloat(valores.valor_jueves) : 0;
                  deduccion.valor_viernes = valores ? parseFloat(valores.valor_viernes) : 0;
                  deduccion.valor_sabado = valores ? parseFloat(valores.valor_sabado) : 0;
                  deduccion.valor_domingo = valores ? parseFloat(valores.valor_domingo) : 0;
                  vm.valores_deducciones.push(deduccion);
              })
        }

        function guardar() {
            var promiseGet = deduccionesService.postInCentral(vm.central.id, vm.valores_deducciones);
            promiseGet.then(function (pl) {
                console.log(pl.data);
            }, function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function cargarDeducciones() {
            vm.Deducciones = [];
            var promiseGet = deduccionesService.getAll();
            promiseGet.then(function (pl) {
                pl.data.forEach(function (deduccion) {
                    if(deduccion.estado){
                        vm.Deducciones.push(deduccion);
                    }
                })
            }, function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function loadCentrales() {
            if (!vm.centrales) {
                centralesService.getAll().then(success, error);
            }
            function success(p) {
                vm.centrales = p.data;
            }

            function error(error) {
                console.log('Error al cargar centrales');
            }
        }

    }
})();