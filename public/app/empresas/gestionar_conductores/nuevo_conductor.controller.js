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
        .controller('ConductorNuevoController', ConductorNuevoController);

    function ConductorNuevoController(conductoresEmpresaService, centralesService, $filter) {
        var vm = this;
        vm.addmode = true;
        vm.Conductor = {
            apellidos: "Pérez Machado",
            correo: "tavo5@correo.com",
            direccion: "calle 32 #  77-70",
            fecha_licencia: new Date("2017-08-12") ,
            fecha_seguroac: new Date("2017-08-12") ,
            identificacion: "9202100155",
            nlicencia: "9202100155",
            nombres: "Tavo",
            seguroac: true,
            telefono: "8247242",
            tipo_licencia: "a1",
            toperacion: "9202100155",
            vehiculo: {
                codigo_vial: "777",
                color: "negro",
                cupos: "4",
                fecha_soat: new Date("2017-04-14") ,
                fecha_tecnomecanica: new Date("2017-06-08") ,
                identificacion_propietario: "9202100155",
                modelo: "stick",
                nombre_propietario: "Tavo Pérez",
                placa: "TVP-777",
                soat: true,
                tarjeta_propiedad: true,
                tecnomecanica: true,
                tel_propietario: "8247242",
            }
        };

        vm.guardar = guardar;

        loadCentrales();

        function guardar() {
            vm.Conductor.central_id = vm.Conductor.central.id;
            delete vm.Conductor.central;
            vm.Conductor.fecha_licencia = $filter('date')(vm.fecha_licencia, 'yyyy-MM-dd');
            vm.Conductor.fecha_seguroac = $filter('date')(vm.fecha_seguroac, 'yyyy-MM-dd');
            vm.Conductor.vehiculo.fecha_soat = $filter('date')(vm.fecha_soat, 'yyyy-MM-dd');
            vm.Conductor.vehiculo.fecha_tecnomecanica = $filter('date')(vm.fecha_tecnomecanica, 'yyyy-MM-dd');
            var promisePost = conductoresEmpresaService.post(vm.Conductor);
            promisePost.then(function (pl) {
                if (pl.data.mensajeError) {
                    Materialize.toast(pl.data.mensajeError, 5000, 'rounded');
                } else {
                    Materialize.toast('Conductor Guardado', 5000, 'rounded');
                    vm.addmode = false;
                    vm.conductor_id = pl.data.id;
                    vm.vehiculo_id = pl.data.vehiculo.id;
                    modificarImagen();
                    modificarImagenVehiculo();
                }
            }, function (error) {
                var mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un error inesperado';
                Materialize.toast(mensajeError, 5000, 'rounded');
                console.log('Error al guardar conductor', error);
            });
        }

        function modificarImagen() {
            if (vm.fileimage) {
                var data = new FormData();
                data.append('imagen', vm.fileimage);
                conductoresEmpresaService.postImagen(vm.conductor_id, data).then(success, error);
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
                conductoresEmpresaService.postImagenVehiculo(vm.vehiculo_id, data).then(success, error);
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