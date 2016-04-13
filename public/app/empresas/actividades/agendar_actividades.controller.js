/**
 * Created by tav0 on 6/01/16.
 */
(function() {
    'use strict';

    angular
        .module('app.empresas.actividades')
        .controller('ActividadesController', ActividadesController);

    function ActividadesController(actividadesService, $filter) {
        var vm = this;

        vm.actividades = [];
        vm.actividadesFinalizadas = [];
        vm.selectedActividad = {};
        vm.editMode = false;

        vm.nuevo = nuevo;
        vm.guardar = guardar;
        vm.actualizar = actualizar;
        vm.update = update;

        loadAvtividades();

        function nuevo(){
            vm.editMode = false;
            vm.selectedActividad = {};
            vm.active = "";
            vm.nombreForm = "Agendar Nueva Actividad";
            vm.selectedActividad.estado = 'Pendiente';
            $("#modalNuevaActividad").openModal();
        }

        function guardar(){
            var nActividad = {};
            nActividad.fecha = $filter('date')(vm.selectedActividad.fecha,'yyyy-MM-dd')+' '+
                $filter('date')(vm.selectedActividad.hora,'HH:mm:ss');
            nActividad.nombre = vm.selectedActividad.nombre;
            nActividad.descripcion = vm.selectedActividad.descripcion;
            nActividad.estado = vm.selectedActividad.estado;
            actividadesService.post(nActividad).then(success, error);
            function success(p) {
                $("#modalNuevaActividad").closeModal();
                loadAvtividades();
                Materialize.toast('Registro guardado correctamente', 5000);
            }
            function error(error) {
                console.log('Error al guardar');
            }
        }

        function actualizar(actividad){
            vm.selectedActividad = actividad;
            vm.editMode = true;
            vm.nombreForm = "Modificar Actividad";
            vm.active = "active";
            $("#modalNuevaActividad").openModal();
        }

        function update(){
            var nActividad = {};
            nActividad.fecha = $filter('date')(vm.selectedActividad.fecha,'yyyy-MM-dd')+' '+
                $filter('date')(vm.selectedActividad.hora,'HH:mm:ss');
            nActividad.nombre = vm.selectedActividad.nombre;
            nActividad.descripcion = vm.selectedActividad.descripcion;
            nActividad.estado = vm.selectedActividad.estado;
            nActividad.id = vm.selectedActividad.id;
            actividadesService.put(nActividad).then(success, error);
            function success(p) {
                $("#modalNuevaActividad").closeModal();
                vm.editMode = false;
                loadAvtividades();
                Materialize.toast('Registro modificado correctamente', 5000);
            }
            function error(error) {
                console.log('Error al actualizar');
            }
        }

        function loadAvtividades(){
            vm.actividades = [];
            actividadesService.getAll().then(success, error);
            function success(p) {
                for(var i=0; i<p.data.length; i++){
                    p.data[i].fecha = new Date(p.data[i].fecha);
                    p.data[i].hora = new Date(p.data[i].fecha);
                    if(p.data[i].estado === "Finalizada"){
                        vm.actividadesFinalizadas.push(p.data[i]);
                    }else{
                        vm.actividades.push(p.data[i]);
                    }
                }
            }
            function error(error) {
                console.log('Error al cargar datos');
            }
        }
    }
})();