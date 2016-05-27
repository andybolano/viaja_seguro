/**
 * Created by tav0 on 6/01/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .controller('ConductorController', ConductorController);

    function ConductorController(conductoresEmpresaService, $state) {
        var vm = this;
        vm.carga = false;
        vm.Conductores = []
        vm.ConductoresInactivos = []
        vm.n_cond_doc_venc = 0;
        vm.activos = true;
        vm.mode = 'new';

        vm.nuevoConductor = nuevoConductor;
        vm.modificar = modificar;
        vm.openhabilitar = openhabilitar;
        vm.eliminar = eliminar;

        cargarConductores();

        function nuevoConductor() {
            conductoresEmpresaService.conductor = {};
            $state.go('app.empresas_nuevo_conductor');
        }

        function modificar(conductor) {
            conductoresEmpresaService.conductor = conductor;
            $state.go('app.empresas_detalles_conductor', {conductor_id: conductor.id});
        }

        function openhabilitar(conductor) {
            conductoresEmpresaService.conductor = conductor;
            $state.go('app.empresas_detalles_conductor', {conductor_id: conductor.id});
        };

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
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    var promiseDelete = conductoresEmpresaService.delete(id);
                    swal.disableButtons();
                    promiseDelete.then(function (pl) {
                        setTimeout(function () {
                            swal({
                                title: 'Exito!',
                                text: 'Conductor inhabilitado correctamente',
                                type: 'success',
                                showCancelButton: false,
                            }, function () {
                                cargarConductores();
                            });
                        }, 1000);
                    }, function (errorPl) {
                        swal({
                            title: 'Error!',
                            text: 'No se pudo inhabilitar el conductor seleccionado',
                            type: 'error',
                            showCancelButton: false,
                        }, function () {
                        });
                    });
                }
            });
        }

        function cargarConductores() {
            vm.Conductores = []
            vm.ConductoresInactivos = []
            var promiseGet = conductoresEmpresaService.getAll();
            promiseGet.then(function (p) {
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].activo == true) {
                        p.data[i].doc_venc = documentacionPorVencer(p.data[i]);
                        vm.Conductores.push(p.data[i]);
                    } else {
                        vm.ConductoresInactivos.push(p.data[i]);
                    }
                }
            }, function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }
        
        function documentacionPorVencer(conductor) {
            const fecha_licencia = conductor.fecha_licencia ? new Date(conductor.fecha_licencia) : null;
            const fecha_seguroac = conductor.fecha_seguroac ? new Date(conductor.fecha_seguroac) : null;
            const fecha_soat = conductor.vehiculo.fecha_soat ? new Date(conductor.vehiculo.fecha_soat) : null;
            const fecha_tecnomecanica = conductor.vehiculo.fecha_tecnomecanica ? new Date(conductor.vehiculo.fecha_tecnomecanica) : null;
            var diferencia = Math.floor((fecha_licencia - new Date()) / (1000 * 60 * 60 * 24))
            if(diferencia <= 30){
                conductor.pv_licencia = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_seguroac - new Date()) / (1000 * 60 * 60 * 24))
            if(diferencia <= 30){
                conductor.pv_seguroac = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_soat - new Date()) / (1000 * 60 * 60 * 24))
            if(diferencia <= 30){
                conductor.pv_soat = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_tecnomecanica - new Date()) / (1000 * 60 * 60 * 24))
            if(diferencia <= 30){
                conductor.pv_tecnomecanica = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            return false;
        }
    }
})();