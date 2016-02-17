/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.conductores')
        .controller('ConductorController', ConductorController);

    function ConductorController(conductoresEmpresaService, centralesService, $filter) {
        var vm = this;
        vm.Conductores = [];
        vm.ConductoresInactivos = [];
        vm.activos = true;
        vm.mode = 'new';

        vm.nuevoConductor = nuevoConductor;
        vm.modificar = modificar;
        vm.openhabilitar = openhabilitar;
        vm.guardar = guardar;
        vm.update = update;
        vm.habilitar = habilitar;
        vm.eliminar = eliminar;

        cargarConductores();

        function nuevoConductor(){
            vm.mode = 'new';
            vm.active = "";
            vm.titulo = "Registrar Conductor";
            vm.Conductor = {};
            vm.Vehiculo = {};
            loadCentrales();
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" ng-src="http://',vm.Conductor.imagen,'" title="imagen" alt="seleccione foto"/>'].join('');
            $("#modalNuevoConductor").openModal();
        }

        function modificar(conductor) {
            vm.mode = 'edit';
            vm.titulo = "Modificar conductor"
            vm.active = "active";
            vm.Conductor = conductor;
            cargarVehiculo();
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" src="http://',vm.Conductor.imagen,'" title="imagen" alt="seleccione foto"/>'].join('');
            loadCentrales();
            $("#modalNuevoConductor").openModal();
        }

        function openhabilitar(conductor){
            vm.mode = 'hbltr';
            vm.titulo = "Habilitar conductor"
            vm.active = "active";
            vm.Conductor = conductor;
            document.getElementById("image").innerHTML = ['<img class="thumb center" id="imagenlogo" style="width:100%" src="http://',vm.Conductor.imagen,'" title="imagen" alt="seleccione foto"/>'].join('');
            cargarVehiculo();
            loadCentrales();
            $("#modalNuevoConductor").openModal();
        };

        function guardar(){
            vm.Conductor.central_id = vm.Conductor.central.id;
            delete vm.Conductor.central;
            vm.Vehiculo.fecha_soat = $filter('date')(vm.Vehiculo.fecha_soat, 'yyyy-MM-dd');
            vm.Vehiculo.fecha_tecnomecanica = $filter('date')(vm.Vehiculo.fecha_tecnomecanica, 'yyyy-MM-dd');
            vm.Conductor.vehiculo = vm.Vehiculo;
            var promisePost = conductoresEmpresaService.post(vm.Conductor);
            promisePost.then(function (pl) {
                $("#modalNuevoConductor").closeModal();
                Materialize.toast(pl.data.message, 5000, 'rounded');
                modificarImagen();
                modificarImagenVehiculo();
                cargarConductores();
            },function (errorPl) {
                console.log('Error al guardar conductor', errorPl);
            });
        }

        function update(){
            vm.Conductor.central_id = vm.Conductor.central.id;
            delete vm.Conductor.central;
            var promisePut = conductoresEmpresaService.put(vm.Conductor ,vm.Conductor.id);
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

        function habilitar(){
            vm.Conductor.central_id = vm.Conductor.central.id;
            vm.Conductor.activo = true;
            delete vm.Conductor.central;
            var promisePut = conductoresEmpresaService.put(vm.Conductor, vm.Conductor.id);
            promisePut.then(function (pl) {
                    Materialize.toast('Conductor habilitado', 5000, 'rounded');
                    cargarConductores();
                    $("#modalNuevoConductor").closeModal();
                },
                function (errorPl) {
                    console.log('Error habilitar conductor', errorPl);
                });
        }

        function eliminar(id) {
            if(confirm('¿Deseas eliminar el registro?') == true) {
                var promiseDelete = conductoresEmpresaService.delete(id);
                promiseDelete.then(function (pl) {
                        Materialize.toast(pl.data.message, 5000, 'rounded');
                        cargarConductores();
                    },
                    function (errorPl) {
                        console.log('No se pudo eliminar el registro', errorPl);
                    });
            }
        }

        function modificarImagen(){
            if(vm.fileimage) {
                var data = new FormData();
                data.append('imagen', vm.fileimage);
                conductoresEmpresaService.postImagen(vm.Conductor.id, data).then(success, error);
            }
            function success(p) {
                vm.Conductor.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardado correctamente', 5000);
            }
            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }

        function modificarImagenVehiculo(){
            if(vm.fileimageV) {
                var data = new FormData();
                data.append('imagenv', vm.fileimageV);
                conductoresEmpresaService.postImagenVehiculo(vm.Vehiculo.id, data).then(success, error);
            }
            function success(p) {
                vm.Vehiculo.imagen = p.data.nombrefile;
                Materialize.toast('Imagen guardada correctamente', 5000);
            }

            function error(error) {
                Materialize.toast('No se pudo guardar el archivo, error inesperado', 5000);
                console.log('Error al guardar', error);
            }
        }

        function cargarConductores() {
            vm.Conductores = [];
            vm.ConductoresInactivos = [];
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

        function cargarVehiculo() {
            var promiseGet = conductoresEmpresaService.getVehiculoConductor(vm.Conductor.id);
            promiseGet.then(function (p) {
                vm.Vehiculo = p.data;
                vm.Vehiculo.fecha_soat = vm.Vehiculo.fecha_soat ? new Date(vm.Vehiculo.fecha_soat) : new Date();
                vm.Vehiculo.fecha_tecnomecanica = vm.Vehiculo.fecha_tecnomecanica ? new Date(vm.Vehiculo.fecha_tecnomecanica) : new Date();
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