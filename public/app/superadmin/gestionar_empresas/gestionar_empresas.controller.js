/**
 * Created by tav0 on 4/01/16.
 */

(function() {
    'use strict';

    angular
        .module('app.empresas.actividades')
        .controller('GestionarEmpresasController', GestionarEmpresasController);

    function GestionarEmpresasController(empresasService, serviciosEmpresaService) {
        var vm = this;

        vm.selectedEmpresa = {};
        vm.empresas = [];
        vm.editMode = false;
        vm.nombreForm = "";
        vm.active = "";

        //funciones
        vm.nuevo = nuevo;
        vm.guardar = guardar;
        vm.actualizar = actualizar;
        vm.update = update;
        vm.eliminar = eliminar;
        vm.modificarImagen = modificarImagen;
        vm.generarDatosAcceso = generarDatosAcceso;

        init();
        function init() {
            vm.selectedEmpresa = {};
            vm.empresas = [];
            loadEmpresas();
            loadServicios();
        }

        function loadEmpresas() {
            empresasService.getAll().then(success, error);
            function success(p) {
                vm.empresas = p.data;
            }

            function error(error) {
                console.log('Error al cargar datos', error);
            }
        }

        function loadServicios() {
            if(vm.servicios) return;
            serviciosEmpresaService.getAll().then(success, error);
            function success(p) {
                vm.servicios = p.data;
            }

            function error(error) {
                console.log('Error al cargar Servicios', error);
            }
        }

        function checkServicios(empresa) {
            for (var i = 0; i < vm.servicios.length; i++) {
                vm.servicios[i].selected = false;
                for (var j = 0; j < empresa.servicios.length; j++) {
                    if (vm.servicios[i].id == empresa.servicios[j].id) {
                        vm.servicios[i].selected = true;
                        j = empresa.servicios.length;
                    }
                }
            }
        }

        function updateServicios(empresa) {
            for (var i = 0; i < vm.servicios.length; i++) {
                var esta = false;
                var index = -1;
                for (var j = 0; j < empresa.servicios.length; j++) {
                    if (vm.servicios[i].id == empresa.servicios[j].id) {
                        esta = true;
                        index = j;
                        j = empresa.servicios.length;
                    }
                }
                if (!esta && vm.servicios[i].selected) {
                    empresa.servicios.push({
                        id: vm.servicios[i].id,
                        concepto: vm.servicios[i].concepto
                    });
                } else if (esta && !vm.servicios[i].selected) {
                    empresa.servicios.splice(index, 1);
                }
            }
        }

        function nuevo() {
            vm.selectedEmpresa = {};
            vm.selectedEmpresa.servicios = [];
            vm.selectedEmpresa.usuario = {};
            vm.nombreForm = "Nueva Empresa";
            vm.active = "";
            vm.editMode = false;
            vm.fileimage = null;
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" ng-src="http://',vm.selectedEmpresa.logo,'" title="logo" alt="seleccione imagen"/>'].join('');
            loadServicios();
            $("#modalNuevaEmpresa").openModal();
        }

        function guardar() {
            updateServicios(vm.selectedEmpresa);
            empresasService.post(vm.selectedEmpresa).then(success, error);
            function success(p) {

                $("#modalNuevaEmpresa").closeModal();
                vm.selectedEmpresa = p.data;
                modificarImagen();
                //vm.empresas.push(vm.selectedEmpresa);
                init();
                Materialize.toast('Registro guardado correctamente', 5000);
            }

            function error(error) {
                console.log('Error al guardar', error);
            }
        }

        function actualizar(empresa) {
            checkServicios(empresa);
            vm.selectedEmpresa = empresa;
            vm.editMode = true;
            vm.nombreForm = "Modificar Empresa";
            vm.active = "active";
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" src="http://',vm.selectedEmpresa.logo,'" title="logo" alt="seleccione imagen"/>'].join('');
            $("#modalNuevaEmpresa").openModal();
        }

        function modificarImagen() {
            if (vm.fileimage) {
                var data = new FormData();
                data.append('logo', vm.fileimage);
                empresasService.postLogo(vm.selectedEmpresa.id, data).then(success, error);
            }
            function success(p) {
                init();
                vm.selectedEmpresa.logo = p.data.nombrefile;
                Materialize.toast('Logo guardado correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }

        function update() {
            updateServicios(vm.selectedEmpresa);
            empresasService.put(vm.selectedEmpresa, vm.selectedEmpresa.id).then(success, error);
            function success(p) {
                $("#modalNuevaEmpresa").closeModal();
                vm.editMode = false;
                modificarImagen();
                init();
                Materialize.toast('Registro modificado correctamente', 5000);
            }

            function error(error) {
                console.log('Error al actualizar', error);
            }
        }

        function eliminar(codigo) {
            if (confirm('¿Deseas eliminar el registro? \n no es recomendable') == true) {
                empresasService.delete(codigo).then(success, error);
            }
            function success(p) {
                init();
                Materialize.toast('Registro eliminado', 5000);
            }

            function error(error) {
                console.log('Error al eliminar', error);
            }
        }

        function generarDatosAcceso() {
            vm.selectedEmpresa.usuario.nombre = (vm.selectedEmpresa.nombre.toLowerCase() + '_' + Math.floor((Math.random() * (999 - 101 + 1)) + 101)).replace(/\s+/g, '');
            vm.selectedEmpresa.usuario.contrasena = vm.selectedEmpresa.usuario.nombre;
        }

    }
})();