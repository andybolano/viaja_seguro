(function() {
    'use strict';

    angular
        .module('app.centrales.turnos')
        .controller('turnosController', turnosController);

    function turnosController(turnosService, planillasService, authService) {
        var vm = this;

        vm.conductores = [];
        vm.selectedTurno = {};
        vm.rutas = [];
        vm.selectedRuta = {};

        vm.Pasajeros = {};
        vm.Paquetes = {};
        vm.Giros = {};
        vm.listaPasajeros = [];
        vm.listaPaquetes = [];
        vm.listaGiros = [];
        vm.cupos = 0;

        vm.servicios = authService.currentUser().central.empresa.servicios;

        vm.addNewConductor = addNewConductor;
        vm.selectConductor = selectConductor;
        vm.remove = remove;
        vm.movedConductor = movedConductor;
        vm.addConductor = addConductor;
        vm.updateTurnos = updateTurnos;
        //vehiculo
        vm.verVehiculo = verVehiculo;
        //cliente
        vm.getCliente = getCliente;
        //pasajeros
        vm.addPasajero = addPasajero;
        vm.asignarPasajero = asignarPasajero;
        vm.cargarModificarPasajero = cargarModificarPasajero;
        vm.modificarPasajero = modificarPasajero;
        vm.eliminarPasajero = eliminarPasajero;
        //giros
        vm.addGiro = addGiro;
        vm.asignarGiro = asignarGiro;
        vm.cargarModificarGiro = cargarModificarGiro;
        vm.modificarGiro = modificarGiro;
        vm.eliminarGiro = eliminarGiro;
        //paquetes
        vm.addPaquete = addPaquete;
        vm.asignarPaquete = asignarPaquete;
        vm.cargarModificarPaquete = cargarModificarPaquete;
        vm.modificarPaquete = modificarPaquete;
        vm.eliminarPaquete = eliminarPaquete;
        vm.verDescripcionPaquete = verDescripcionPaquete;

        //despacho
        vm.limpiarPasajeros = limpiarPasajeros;
        vm.limpiarGiros = limpiarGiros;
        vm.limpiarPaquetes = limpiarPaquetes;

        vm.despacharConductor = despacharConductor;
        vm.imprimir = imprimir;

        initialize();
        function initialize(){
            cargarRutas();
            cargarDeducciones();
        }

        function addNewConductor(ruta){
            vm.selectedRuta = ruta;
            $("#modalBuscarconductor").openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function() { cargarConductores(ruta.id); }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function cargarConductores(ruta_id) {
            vm.Conductores = [];
            var promiseGet = turnosService.getConductoresEnRuta(ruta_id);
            promiseGet.then(function (p) {
                for(var i = 0; i < p.data.length; i++ ) {
                    if(p.data[i].activo == true && p.data[i].estado == 'Disponible'){
                        vm.Conductores.push(p.data[i]);
                    }
                }
            },function (errorPl) {
                console.log('Error al cargar los conductores de la central', errorPl);
            });
        }

        function selectConductor (conductor){
            if(conductor.estado == 'En ruta'){
                Materialize.toast('Este conductor aun se encuentra en ruta','5000',"rounded");
            }else{
                var nuevoTurno = {
                    'ruta_id': vm.selectedRuta.id,
                    'conductor_id': conductor.id,
                    'turno': vm.selectedRuta.turnos.length+1,
                    'conductor': conductor
                };
                vm.selectedRuta.turnos.push(nuevoTurno);
                updateTurnos(vm.selectedRuta);
                $("#modalBuscarconductor").closeModal();
            }
        }

        function remove(ruta, $index){
            ruta.turnos.splice($index, 1);
            updateTurnos(ruta);
        }

        function movedConductor(ruta, $index){
            ruta.turnos.splice($index, 1);
        }

        function addConductor(ruta){
            updateTurnos(ruta);
        }

        function updateTurnos(ruta){
            for(var i=0; i<ruta.turnos.length; i++){
                ruta.turnos[i].turno = i+1;
            }
            turnosService.updateTurnos(ruta.id, {'turnos' : ruta.turnos}).then(success, error);
            function success(p) {
            }
            function error(error) {
                console.log('Error al cargar conductores', error);
            }
        }

        function cargarRutas() {
            turnosService.getRutasCentral().then(success, error);
            function success(p) {
                vm.rutas = p.data;
            }
            function error(error) {
                console.log('Error al cargar conductores', error);
            }
        }

        function cargarVehiculoConductor(conductor_id){
            vm.cupos = 0;
            vm.vehiculo = {};
            turnosService.cargarVehiculoConductor(conductor_id).then(success, error);
            function success(p) {
                vm.vehiculo = p.data;
                vm.cupos = vm.vehiculo.cupos - vm.cantidad;
                vm.vehiculo.fecha_soat = new Date(p.data.fecha_soat);
                vm.vehiculo.fecha_tecnomecanica = new Date(p.data.fecha_tecnomecanica);
            }
            function error(error) {
                console.log('Error los datos del vehiculo', error);
            }
        }

        //PASAJEROS
        function refrescarPasajeros(conductor_id){
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
            turnosService.refrescarPasajeros(conductor_id).then(success, error);
            function  success(p){
                vm.listaPasajeros = [];
                for(var i=0; i<p.data.length; i++){
                    if(p.data[i].estado == "En ruta" && p.data[i].conductor_id == conductor_id ){
                        vm.listaPasajeros.push(p.data[i]);
                        vm.Pasajeros = {};
                    }else{
                        console.log('algun error');
                    }
                }
                if(vm.listaPasajeros.length <= 0){
                    vm.cantidad = 0;
                }else{
                    vm.cantidad = vm.listaPasajeros.length;
                }
            }
            function error(error){
                console.log('error a traer la lista de pasajeros')
            }
        }

        function verVehiculo(conductor){
            vm.conductor = conductor;
            vm.active = 'active';
            $('#modalVehiculo').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function() { cargarVehiculoConductor(vm.conductor.id); }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function getCliente(identificacion){
            vm.cliente = {};
            turnosService.getCliente(identificacion).then(succes, error);
            function succes(p){
                vm.cliente.id = p.data.id;
                //pasajeros
                vm.Pasajeros.nombres = p.data.nombres +' '+ p.data.apellidos;
                vm.Pasajeros.telefono = p.data.telefono;
                vm.Pasajeros.direccion = p.data.direccion;
                //giros
                vm.Giros.nombres = p.data.nombres +' '+ p.data.apellidos;
                vm.Giros.telefono = p.data.telefono;
                vm.Giros.direccion = p.data.direccion;
                //paquetes
                vm.Paquetes.nombres = p.data.nombres +' '+ p.data.apellidos;
                vm.Paquetes.telefono = p.data.telefono;
                vm.Paquetes.direccion = p.data.direccion;
            }
            function error(error){
             console.log('Error al obtener informacion del cliente', error);
            }
        }

        function addPasajero(conductor){
            vm.Pasajeros = {};
            vm.conductor = conductor;
            $('#modalAddPasajero').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function() {
                    refrescarPasajeros(vm.conductor.id);
                    cargarVehiculoConductor(vm.conductor.id);
                    if(vm.cantidad == null){
                        vm.cupos = 0;
                    }else{
                        vm.cupos = vm.vehiculo.cupos - vm.cantidad;
                    }
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function asignarPasajero(){
            vm.Pasajeros.conductor_id = vm.conductor.id;
            vm.Pasajeros.cliente_id = vm.cliente.id;
            if(vm.cupos <= 0){
                Materialize.toast('El conductor no posee cupos disponibles','5000',"rounded");
            }else{
                turnosService.asignarPasajero(vm.Pasajeros).then(success, error);
            }
            function  success(p){
                refrescarPasajeros(vm.conductor.id);
                cargarVehiculoConductor(vm.conductor.id);
                vm.cupos = vm.vehiculo.cupos - vm.cantidad;
                Materialize.toast(p.data.message, '5000', 'rounded');
            }
            function error(error){
                console.log('Error al guardar', error)
            }
        }

        function cargarModificarPasajero(item){
            document.getElementById("actualizar").disabled = false;
            document.getElementById("guardar").disabled = true;
            vm.Pasajeros = item;
        };

        function modificarPasajero(){
            turnosService.modificarPasajero(vm.Pasajeros.id, vm.Pasajeros).then(success, error);
            function  success(p){
                Materialize.toast(p.data.message,'5000',"rounded");
                refrescarPasajeros(vm.conductor.id);
                document.getElementById("guardar").disabled = false;
                document.getElementById("actualizar").disabled = true;
            }
            function error(error){
                console.log('Error al guardar')
            }
        };

        function eliminarPasajero(pasajero_id){
            turnosService.eliminarPasajero(pasajero_id).then(succes, error);
            function succes(p){
                cargarVehiculoConductor(vm.conductor.id);
                refrescarPasajeros(vm.conductor.id);
                vm.cupos = vm.vehiculo.cupos - vm.cantidad;
                Materialize.toast(p.data.message, '5000', 'rounded');
            }
            function error(error){
                console.log('error al eliminar', error);
            }
        }
        //FIN PASAJEROS

        //GIROS
        function refrescarGiros(conductor_id){
            document.getElementById("guardarG").disabled = false;
            document.getElementById("actualizarG").disabled = true;
            turnosService.refrescarGiros(conductor_id).then(success, error);
            function  success(p){
                vm.listaGiros = [];
                for(var i=0; i<p.data.length; i++){
                    if(p.data[i].estado == "En ruta" ){
                        vm.listaGiros.push(p.data[i]);
                        vm.Giros = {};
                    }else{
                        console.log('algun error');
                    }
                }
            }
            function error(error){
                console.log('error a traer la lista de pasajeros')
            }
        }

        function addGiro(conductor){
            vm.Giros = {};
            vm.conductor = conductor;
            refrescarGiros(vm.conductor.id);
            $('#modalAddGiro').openModal();
        }

        function asignarGiro(){
            vm.Giros.cliente_id = vm.cliente.id;
            vm.Giros.conductor_id = vm.conductor.id;
            turnosService.asignarGiro(vm.Giros).then(success, error);
            function  success(p){
                Materialize.toast(p.data.message,'5000',"rounded");
                refrescarGiros(vm.conductor.id);
            }
            function error(error){
                console.log('Error al guardar')
            }
        }

        function cargarModificarGiro(item){
            document.getElementById("actualizarG").disabled = false;
            document.getElementById("guardarG").disabled = true;
            vm.Giros = item;
        };

        function modificarGiro(){
            turnosService.modificarGiro(vm.Giros.id, vm.Giros).then(success, error);
            function  success(p){
                Materialize.toast(p.data.message,'5000',"rounded");
                refrescarGiros(vm.conductor.id);
                document.getElementById("guardarG").disabled = false;
                document.getElementById("actualizarG").disabled = true;
            }
            function error(error){
                console.log('Error al guardar')
            }
        };

        function eliminarGiro(giro_id){
            turnosService.eliminarGiro(giro_id).then(succes, error);
            function succes(p){
                refrescarGiros(vm.conductor.id);
                Materialize.toast(p.data.message, '5000', 'rounded');
            }
            function error(error){
                console.log('error al eliminar')
            }
        }
        //FIN GIROS

        //PAQUETES
        function refrescarPaquetes(conductor_id){
            document.getElementById("guardarP").disabled = false;
            document.getElementById("actualizarP").disabled = true;
            turnosService.refrescarPaquetes(conductor_id).then(success, error);
            function  success(p){
                vm.listaPaquetes = [];
                for(var i=0; i<p.data.length; i++){
                    if(p.data[i].estado == "En ruta" ){
                        vm.listaPaquetes.push(p.data[i]);
                        vm.Paquetes = {};
                    }else{
                        console.log('algun error');
                    }
                }
            }
            function error(error){
                console.log('error a traer la lista de paquetes')
            }
        }

        function addPaquete(conductor){
            vm.Paquetes = {};
            vm.conductor = conductor;
            refrescarPaquetes(vm.conductor.id);
            $('#modalAddPaquetes').openModal();
        }

        function asignarPaquete(){
            vm.Paquetes.cliente_id = vm.cliente.id;
            vm.Paquetes.conductor_id = vm.conductor.id;
            turnosService.asignarPaquete(vm.Paquetes).then(success, error);
            function  success(p){
                refrescarPaquetes(vm.conductor.id);
                Materialize.toast(p.data.message, '5000', 'rounded');
            }
            function error(error){
                console.log('Error al guardar')
            }
        }

        function cargarModificarPaquete(item){
            document.getElementById("actualizarP").disabled = false;
            document.getElementById("guardarP").disabled = true;
            vm.Paquetes = item;
        };

        function modificarPaquete(){
            turnosService.modificarPaquete(vm.Paquetes.id, vm.Paquetes).then(success, error);
            function  success(p){
                Materialize.toast(p.data.message, '5000', 'rounded');
                refrescarPaquetes(vm.conductor.id);
                document.getElementById("guardarP").disabled = false;
                document.getElementById("actualizarP").disabled = true;
            }
            function error(error){
                console.log('Error al guardar')
            }
        };

        function verDescripcionPaquete(paquete){
            vm.Paquete = paquete;
            $('#modalDescripcionPaquete').openModal();
        }

        function eliminarPaquete(paquete_id){
            turnosService.eliminarPaquete(paquete_id).then(succes, error);
            function succes(p){
                refrescarPaquetes(vm.conductor.id);
                Materialize.toast(p.data.message, '5000', 'rounded');
            }
            function error(error){
                console.log('error al eliminar')
            }
        }
        //FIN PAQUETES

        function limpiarPasajeros(conductor_id){
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
            refrescarPasajeros(conductor_id)
            vm.Pasajeros = "";
        };

        function limpiarGiros(conductor_id){
            document.getElementById("guardarG").disabled = false;
            document.getElementById("actualizarG").disabled = true;
            refrescarGiros(conductor_id)
            vm.Giros = "";
        };

        function limpiarPaquetes(conductor_id){
            document.getElementById("guardarP").disabled = false;
            document.getElementById("actualizarP").disabled = true;
            refrescarPaquetes(conductor_id)
            vm.Paquetes = "";
        };

        //DESPACHO
        function despacharConductor(ruta_id){
            vm.turnos = {};
            turnosService.getTurno(ruta_id).then(succes, error);
            function succes(p){
                vm.turnos = p.data;
                if(vm.turnos.turno == 1){
                    console.log(vm.turnos)
                    ejecutarDespachoConductor(vm.turnos);
                }

            }
            function error(error){
                Materialize.toast(error.message, 5000);
            }
        }

        function ejecutarDespachoConductor(datos){
            vm.Planilla = {};
            if(vm.cupos > 0){
                if(confirm('Este conductor aun tiene cupos disponibles, quieres despacharlo?') == true) {
                    var obj = {
                        ruta_id : datos.ruta_id,
                        turno : datos.turno,
                        conductor_id : datos.conductor_id,
                        deducciones : vm.Deducciones
                    }
                    console.log(obj);
                    turnosService.eliminarTurno(obj).then(succes, error);
                }
            }
            function succes(p){
                vm.Planilla = p.data;
                vm.Planilla.total = p.data.viaje.planilla.total;
                console.log(vm.Planilla)
                cargarRutas();
                if (p.data.message == 'Despachado correctamente'){
                    Materialize.toast(p.data.message, 5000);
                    $('#modalPlanilla').openModal();
                }else{
                    Materialize.toast(vm.Planilla.message, 5000);
                }
            }
            function error(error){
                Materialize.toast(error.message, 5000);
            }
        }

        function cargarDeducciones(){
            var promiseGet = planillasService.getDeducciones();
            promiseGet.then(function (p) {
                vm.Deducciones = [];
                for(var i=0; i<p.data.length; i++){
                    if(p.data[i].estado == true ){
                        vm.Deducciones.push(p.data[i]);
                    }else{
                        console.log('algun error');
                    }
                }
            },function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        function imprimir(){
            var ficha = document.getElementById('planilla');
            var ventimp = window.open(' ', 'popimpr');
            ventimp.document.write( ficha.innerHTML );
            ventimp.document.close();
            var css = ventimp.document.createElement("link");
            css.setAttribute("href", "../assets/css/pdf.css");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            ventimp.document.head.appendChild(css);
            ventimp.print( );
            ventimp.close();
        }
    }
})();