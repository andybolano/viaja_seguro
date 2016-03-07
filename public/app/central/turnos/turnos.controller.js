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

        //solicitudes
        vm.getSolicitudes = getSolicitudes;
        vm.getSolicitud = getSolicitud;


        vm.despacharConductor = despacharConductor;
        vm.imprimir = imprimir;

        initialize();
        function initialize() {
            cargarRutas();
            cargarDeducciones();
            getSolicitudes();
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
            swal({
                title: 'ESTAS SEGURO!',
                text: 'Intentas remover este conductor de la ruta',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Remover',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            }, function(isConfirm) {
                if(isConfirm){
                    swal.disableButtons();
                    setTimeout(function() {
                        swal({
                            title: 'Exito!',
                            text: 'Has removido al condcutor de la ruta',
                            type: 'success',
                            showCancelButton: false,
                        }, function() {
                            ruta.turnos.splice($index, 1);
                            updateTurnos(ruta);
                        });
                    }, 2000);
                }
            });
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
                vm.solicitudes = p.data.rutas.solicitudes;
            }
            function error(error) {
                console.log('Error al cargar conductores', error);
            }
        }

        function cargarVehiculoConductor(conductor_id){
            //vm.cupos = 0;
            vm.vehiculo = {};
            turnosService.cargarVehiculoConductor(conductor_id).then(success, error);
            function success(p) {
                vm.vehiculo = p.data;
                //vm.cupos = vm.vehiculo.cupos - vm.cantidad;
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
            getCuposDisponiblesConductor(conductor_id);
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
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado eliminar un pasajero, esto liberara un cupo al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    turnosService.eliminarPasajero(pasajero_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    setTimeout(function() {
                        swal({
                            title: 'Exito!',
                            text: 'Pasajero retirado correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }, function() {
                            refrescarPasajeros(vm.conductor.id);
                        })
                    }, 2000);
                }
                function error(error) {
                    swal({
                        title: 'Error!',
                        text: 'No se pudo retirar al pasajero seleccionado',
                        type: 'error',
                        showCancelButton: false,
                    }, function() {
                    })
                }
            });
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
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado retirar un giro designado al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    turnosService.eliminarGiro(giro_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    setTimeout(function() {
                        swal({
                            title: 'Exito!',
                            text: 'Giro retirado correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }, function() {
                            refrescarGiros(vm.conductor.id);
                        })
                    }, 2000);
                }
                function error(error) {
                    swal({
                        title: 'Error!',
                        text: 'No se pudo retirar giro seleccionado',
                        type: 'error',
                        showCancelButton: false,
                    }, function() {
                    })
                }
            });
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
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado retirar un paquete designado al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: false
            },function(isConfirm){
                if(isConfirm){
                    turnosService.eliminarPaquete(paquete_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    setTimeout(function() {
                        swal({
                            title: 'Exito!',
                            text: 'Paquete retirado correctamente',
                            type: 'success',
                            showCancelButton: false,
                        }, function() {
                            refrescarPaquetes(vm.conductor.id);
                        })
                    }, 2000);
                }
                function error(error) {
                    swal({
                        title: 'Error!',
                        text: 'No se pudo retirar paquete seleccionado',
                        type: 'error',
                        showCancelButton: false,
                    }, function() {
                    })
                }
            });
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
                    ejecutarDespachoConductor(vm.turnos);
                }

            }
            function error(error){
                Materialize.toast(error.message, 5000);
            }
        }

        function getCuposDisponiblesConductor(conductor_id){
            turnosService.getCupos(conductor_id).then(succes, error);
            function succes(d){
                vm.cupos = d.data;
            }
            function error(e){

            }
        }

        function ejecutarDespachoConductor(datos){
            vm.Planilla = {};
            var obj = {
                ruta_id : datos.ruta_id,
                turno : datos.turno,
                conductor_id : datos.conductor_id,
                deducciones : vm.Deducciones
            }
            turnosService.getCupos(datos.conductor_id).then(function(p){
                if(p.data != 0){
                    swal({
                        title: 'ESPERA UN MOMENTO!',
                        text: 'El conductor en turno aun tiene cupos disponibles',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Despachar',
                        cancelButtonText: 'Cancelar',
                        closeOnConfirm: false
                    }, function(isConfirm) {
                        if (isConfirm) {
                            turnosService.eliminarTurno(obj).then(succes, error);
                        }
                        function succes(p){
                            vm.Planilla = p.data;
                            vm.Planilla.total = p.data.viaje.planilla.total;
                            swal.disableButtons();
                            setTimeout(function() {
                                swal({
                                    title: 'Exito!',
                                    text: 'El coductor ha sido despachado exitosamete',
                                    type: 'success',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Mostrar planilla',
                                    cancelButtonText: 'Cerrar',
                                    closeOnConfirm: true
                                }, function() {
                                    $('#modalPlanilla').openModal();
                                    cargarRutas();
                                });
                            }, 3000);
                        }
                        function error(error){
                            swal(
                                'ERROR!!',
                                'Ocurrio un error al despachar el conductor)',
                                'error'
                            );
                        }
                    });
                }else{
                    swal({
                        title: '',
                        text: 'ESTA A PUNTO DE DESPACHAR AL CONDUCTOR EN TURNO',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Despachar',
                        cancelButtonText: 'Cancelar',
                        closeOnConfirm: false
                    }, function(isConfirm) {
                        if (isConfirm) {
                            turnosService.eliminarTurno(obj).then(succes, error);
                        }
                        function succes(p){
                            vm.Planilla = p.data;
                            vm.Planilla.total = p.data.viaje.planilla.total;
                            swal.disableButtons();
                            setTimeout(function() {
                                swal({
                                    title: 'Exito!',
                                    text: 'El coductor ha sido despachado exitosamete',
                                    type: 'success',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Mostrar planilla',
                                    cancelButtonText: 'Cerrar',
                                    closeOnConfirm: true
                                }, function() {
                                    $('#modalPlanilla').openModal();
                                    cargarRutas();
                                });
                            }, 2000);
                        }
                        function error(error){
                            swal(
                                'ERROR!!',
                                'Ocurrio un error al despachar el conductor)',
                                'error'     );
                        }
                    });
                }
            });
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

        function getSolicitudes(){
            vm.solicitudes = [];
            turnosService.getSolicitudesPasajeros().then(success, error);
            function success(p){
                for (var i = 0; i < p.data.length; i++){
                    vm.solicitudes[i] = p.data[i];
                }
            }
            function error(e){

            }
        }

        function getSolicitud(solicitud_id){
            vm.solicitud = [];
            $('#modalSolicitud').openModal();
            turnosService.getSolicitudPasajero(solicitud_id).then(success, error);
            function success(p){
                //for(var i = 0; i < p.data.length; i++){
                //    vm.solicitud[i] = p.data[i];
                //}
                vm.solicitud = p.data;
                for(var i = 0; i < p.data.conductores.cupos;i++){
                    vm.solicitud.conductores.conductor.cupo[i] = p.data.conductores.cupos[i].total
                }
                console.log(vm.solicitud)
            }
            function error(e){
                console.log('Error al cargar la solicitud');
            }

        }
    }
})();