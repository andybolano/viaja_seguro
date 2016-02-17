/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.deducciones')
        .controller('deduccionesController', deduccionesController);

    function deduccionesController(deduccionesService) {
        var vm = this;
        vm.titulo;
        vm.active;
        vm.editMode = false;
        initialize();

        vm.nuevaDeduccion = nuevaDeduccion;
        vm.updateEstado = updateEstado;
        vm.update = update;
        vm.modificar = modificar;
        vm.guardar =guardar;
        vm.eliminar = eliminar;

        function initialize(){
            vm.Deduccion = {}
            cargarDeducciones();
        }
        function cargarDeducciones() {
            vm.Deducciones = [];
            var promiseGet = deduccionesService.getAll();
            promiseGet.then(function (pl) {
                vm.Deducciones = pl.data;
            },function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function nuevaDeduccion() {
            vm.Deduccion = {};
            vm.editMode = false;
            vm.active = "";
            vm.titulo = "Nueva deducción"
            $("#modalNuevaDeduccion").openModal();
        }

        function modificar(deduccion){
            vm.editMode = true;
            vm.Deduccion = deduccion;
            vm.active = "active";
            vm.titulo = "Modificar deducción"
            $("#modalNuevaDeduccion").openModal();
        }

        function updateEstado(deduccion){
            console.log(deduccion.estado)
            //alert(JSON.stringify(object));
            var promisePut = deduccionesService.updateEstado(deduccion.id, deduccion.estado);
            promisePut.then(function (pl) {
                cargarDeducciones();
                Materialize.toast(pl.data.message, 5000, 'rounded');
            }, function (errorPl) {
                console.log('Error al hacer la solicitud', errorPl);
            });
        }

        function guardar() {

            var object = {
                nombre: vm.Deduccion.nombre,
                descripcion: vm.Deduccion.descripcion,
                valor: vm.Deduccion.valor,
                estado: vm.Deduccion.estado
            }
            var promisePost = deduccionesService.post(object);
            promisePost.then(function (pl) {
                    $('#modalNuevaDeduccion').closeModal();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                    cargarDeducciones();
                },
                function (err) {
                    $('#modalNuevaDeduccion').closeModal();
                    Materialize.toast("Error al procesar la solicitud",3000,'rounded');
                    console.log(err);
                });
        }

        function update(){
            var object = {
                nombre: vm.Deduccion.nombre,
                descripcion: vm.Deduccion.descripcion,
                valor: vm.Deduccion.valor,
                estado: vm.Deduccion.estado
            }
            var promisePut = deduccionesService.put(object, vm.Deduccion.id);
            promisePut.then(function (pl) {
                    $('#modalNuevaDeduccion').closeModal();
                    cargarDeducciones();
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                },
                function (err) {
                    $('#modalNuevaDeduccion').closeModal();
                    Materialize.toast("Error al procesar la solicitud",3000,'rounded');
                    console.log(err);
                });
        }

        function eliminar(id){
            if(confirm('¿Deseas eliminar el registro?') == true) {
                var promiseDelete = deduccionesService.delete(id);
                promiseDelete.then(function (pl) {
                        cargarDeducciones();
                        Materialize.toast(pl.data.message, 5000, 'rounded');
                    },
                    function (errorPl) {
                        console.log('No se pudo eliminar el registro', errorPl);
                    });
            }
        }
    }
})();