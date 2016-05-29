/**
 * Created by Jose Soto
 * on 28/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.pasajeros')
        .controller('pasajerosController', pasajerosController);

    function pasajerosController(pasajerosService) {
        var vm = this;
        vm.listaPasajeros = [];
        vm.Pasajeros = {};
        vm.getCliente = getCliente;
        vm.asignarPasajero = asignarPasajero;
        vm.cargarModificarPasajero = cargarModificarPasajero;
        vm.modificarPasajero = modificarPasajero;
        vm.eliminarPasajero = eliminarPasajero;
        vm.limpiarPasajeros = limpiarPasajeros;

        refrescarPasajeros();
        function refrescarPasajeros() {
            vm.listaPasajeros = [];
            vm.Pasajeros = {};
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
            pasajerosService.refrescarPasajeros().then(success, error);
            function success(p) {

                angular.forEach(p.data, function (pasajero) {
                    vm.listaPasajeros.push(pasajero);
                })
            }
            function error(error) {
                console.log('error a traer la lista de pasajeros')
            }
        }

        function getCliente(identificacion) {
            vm.cliente = {};
            pasajerosService.getCliente(identificacion).then(succes, error);
            function succes(p) {
                vm.cliente.id = p.data.id;
                //pasajeros
                vm.Pasajeros.nombres = p.data.nombres + ' ' + p.data.apellidos;
                vm.Pasajeros.telefono = p.data.telefono;
                vm.Pasajeros.direccion = p.data.direccion;
                //giros
                vm.Giros.nombres = p.data.nombres + ' ' + p.data.apellidos;
                vm.Giros.telefono = p.data.telefono;
                vm.Giros.direccion = p.data.direccion;
                //paquetes
                vm.Paquetes.nombres = p.data.nombres + ' ' + p.data.apellidos;
                vm.Paquetes.telefono = p.data.telefono;
                vm.Paquetes.direccion = p.data.direccion;
            }

            function error(error) {
                console.log('Error al obtener informacion del cliente');
            }
        }

        function asignarPasajero() {
            // vm.Pasajeros.cliente_id = vm.cliente.id;
            pasajerosService.asignarPasajero(vm.Pasajeros).then(success, error);
            function success(p) {
                refrescarPasajeros();
                Materialize.toast(p.data.message, '5000', 'rounded');
            }

            function error(error) {
                console.log('Error al guardar')
            }
        }

        function cargarModificarPasajero(item) {
            document.getElementById("actualizar").disabled = false;
            document.getElementById("guardar").disabled = true;
            vm.Pasajeros = item;
        };

        function modificarPasajero() {
            pasajerosService.modificarPasajero(vm.Pasajeros.id, vm.Pasajeros).then(success, error);
            function success(p) {
                Materialize.toast(p.data.message, '5000', "rounded");
                refrescarPasajeros();
                document.getElementById("guardar").disabled = false;
                document.getElementById("actualizar").disabled = true;
            }

            function error(error) {
                console.log('Error al guardar')
            }
        };

        function eliminarPasajero(pasajero_id) {
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado eliminar un pasajero, esto liberara un cupo al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    pasajerosService.eliminarPasajero(pasajero_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    setTimeout(function () {
                        swal({
                            title: 'Exito!',
                            text: 'Pasajero retirado correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }, function () {
                            refrescarPasajeros();
                        })
                    }, 500);
                }

                function error(error) {
                    swal({
                        title: 'Error!',
                        text: 'No se pudo retirar al pasajero seleccionado',
                        type: 'error',
                        showCancelButton: false,
                    }, function () {
                    })
                }
            });
        }

        function limpiarPasajeros() {
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
            refrescarPasajeros()
            vm.Pasajeros = "";
        };
    }
})();
