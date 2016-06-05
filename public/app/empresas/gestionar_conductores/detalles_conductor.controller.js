/**
 * Created by tav0 on 26/05/16.
 */
/**
 * Created by tav0 on 6/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .controller('ConductorDetallesController', ConductorDetallesController);

    function ConductorDetallesController(conductoresEmpresaService, centralesService) {
        var vm = this;
        vm.active = "active";
        vm.Conductor = conductoresEmpresaService.conductor;
        vm.Conductor.fecha_licencia = vm.Conductor.fecha_licencia ? new Date(vm.Conductor.fecha_licencia) : null;
        vm.Conductor.fecha_seguroac = vm.Conductor.fecha_seguroac ? new Date(vm.Conductor.fecha_seguroac) : null;
        vm.Conductor.vehiculo.fecha_soat = vm.Conductor.vehiculo.fecha_soat ? new Date(vm.Conductor.vehiculo.fecha_soat) : null;
        vm.Conductor.vehiculo.fecha_tecnomecanica = vm.Conductor.vehiculo.fecha_tecnomecanica ? new Date(vm.Conductor.vehiculo.fecha_tecnomecanica) : null;

        vm.habilitar = habilitar;
        vm.update = update;
        vm.eliminar = eliminar;

        loadCentrales();

        function habilitar() {
            vm.Conductor.central_id = vm.Conductor.central.id;
            vm.Conductor.activo = true;
            delete vm.Conductor.central;
            var promisePut = conductoresEmpresaService.put(vm.Conductor, vm.Conductor.id);
            promisePut.then(function (pl) {
                    Materialize.toast('Conductor habilitado', 5000, 'rounded');
                },
                function (errorPl) {
                    console.log('Error habilitar conductor', errorPl);
                });
        }

        function update() {
            vm.Conductor.central_id = vm.Conductor.central.id;
            delete vm.Conductor.central;
            var promisePut = conductoresEmpresaService.put(vm.Conductor, vm.Conductor.id);
            promisePut.then(function (pl) {
                    Materialize.toast(pl.data.message, 5000, 'rounded');
                    modificarImagen();
                    cargarConductores();
                    $("#modalNuevoConductor").closeModal();
                },
                function (errorPl) {
                    console.log('Error Al Cargar Datos', errorPl);
                });
        }

        function eliminar(id) {
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Intentas inhabilitar este conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Inhabilitar',
                cancelButtonText: 'Cancelar',
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        swal.enableLoading();
                        setTimeout(function () {
                            resolve();
                        }, 300);
                    });
                },
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    var promiseDelete = conductoresEmpresaService.delete(id);
                    swal.disableButtons();
                    promiseDelete.then(function (pl) {
                        swal({
                            title: 'Exito!',
                            text: 'Conductor inhabilitado correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }).then(function () {
                            cargarConductores();
                        });

                    }, function (errorPl) {
                        swal({
                            title: 'Error!',
                            text: 'No se pudo inhabilitar el conductor seleccionado',
                            type: 'error',
                            showCancelButton: false,
                        }).then(function () {
                        });
                    });
                }
            });
        }

        function modificarImagen() {
            if (vm.fileimage) {
                var data = new FormData();
                data.append('imagen', vm.fileimage);
                conductoresEmpresaService.postImagen(vm.Conductor.id, data).then(success, error);
            }
            function success(p) {
                vm.Conductor.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardado correctamente', 5000);
                cargarConductores();
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar');
            }
        }

        function modificarImagenVehiculo() {
            if (vm.fileimageV) {
                var data = new FormData();
                data.append('imagen', vm.fileimageV);
                conductoresEmpresaService.postImagenVehiculo(vm.Vehiculo.id, data).then(success, error);
            }
            function success(p) {
                vm.Vehiculo.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardada correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar');
            }
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