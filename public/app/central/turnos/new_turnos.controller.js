/**
 * Created by Jose on 15/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.turnos')
        .controller('NewTurnosController', NewTurnosController);

    function NewTurnosController(newTurnosService, planillasService, authService, pasajerosService) {
        // variables
        var vm = this;
        vm.rutas = [];
        vm.conductoresDeRuta = [];
        vm.selectedTurno = {};
        vm.Conductores = [];
        vm.conductorSelected = null;
        vm.indexConductor = null;

        vm.Pasajeros = {};
        vm.Paquetes = {};
        vm.Giros = {};
        vm.listaPasajeros = [];
        vm.listaPaquetes = [];
        vm.listaGiros = [];
        vm.cupos = 0;
        // funciones
        vm.cargarConductoresYSolicitudesDeRuta = cargarConductoresYSolicitudesDeRuta;
        vm.addNewConductor = addNewConductor;
        vm.selectConductor = selectConductor;
        vm.remove = remove;
        vm.movedConductor = movedConductor;
        vm.addConductor = addConductor;
        vm.updateTurnos = updateTurnos;
        vm.verVehiculo = verVehiculo;

        // pasajeros
        vm.addPasajero = addPasajero;
        vm.addNewSolicitudPasajero = addNewSolicitudPasajero;
        vm.asignarSolicitudPasajero = asignarSolicitudPasajero;
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
        //cliente
        vm.getCliente = getCliente;

        vm.limpiarPasajeros = limpiarPasajeros;
        vm.limpiarGiros = limpiarGiros;
        vm.limpiarPaquetes = limpiarPaquetes;

        //solicitudes
        vm.getSolicitudPasajero = getSolicitudPasajero;
        vm.getSolicitudGiro = getSolicitudGiro;
        vm.getSolicitudPaquete = getSolicitudPaquete;

        vm.servicios = authService.currentUser().central.empresa.servicios;

        function init() {
            cargarRutas();
            cargarDeducciones();
            vm.user = authService.currentUser();
        }

        function cargarRutas() {
            newTurnosService.getRutas().then(success, error);
            function success(response) {
                vm.rutas = response.data;
            }

            function error(responseError) {
                console.log('Ocurrio un error')
            }
        }

        function cargarConductoresYSolicitudesDeRuta($index) {
            vm.activeMenu = $index;
            vm.selectedRuta = vm.rutas[$index];
            vm.conductorSelected = null;
            newTurnosService.getConductoresDeRutas(vm.selectedRuta.id).then(function (response) {
                vm.conductoresDeRuta = response.data;
                cargarSolicitudesDeRuta(vm.selectedRuta.id);
            }, function (responseError) {
                console.log('Ocurrio un error')
            });
        }

        function cargarSolicitudesDeRuta(ruta_id) {
            newTurnosService.getSolicitudesDeRuta(ruta_id).then(function (response) {
                vm.solicitudes = response.data;
            }, function (responseError) {
                console.log('Ocurrio un error');
            })
        }

        function movedConductor($index) {
            vm.conductoresDeRuta.splice($index, 1);
        }

        function addConductor(ruta) {
            updateTurnos(ruta, 'agregar');
        }

        vm.selecciondarConductor = function ($index) {
            vm.indexConductor = $index;
            vm.conductorSelected = vm.conductoresDeRuta[$index];
        };

        vm.confirm = function () {
            if (!vm.selectedRuta) {

            } else {
                vm.addNewConductor();
            }
        };

        function updateTurnos(accion) {
            accion || (accion = 'default')
            for (var i = 0; i < vm.conductoresDeRuta.length; i++) {
                vm.conductoresDeRuta[i].turno = i + 1;
            }
            newTurnosService.updateTurnos(vm.selectedRuta.id, {
                'turnos': vm.conductoresDeRuta,
                'accion': accion
            }).then(success, error);
            function success(p) {
            }

            function error(error) {
                console.log('Error al cargar conductores');
            }
        }

        function addNewConductor() {
            $("#modalBuscarconductor").openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    cargarConductores(vm.selectedRuta.id);
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function cargarConductores(ruta_id) {
            vm.Conductores = [];
            var promiseGet = newTurnosService.getConductoresEnRuta(ruta_id);
            promiseGet.then(function (p) {
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].activo == true && p.data[i].estado == 'Disponible') {
                        vm.Conductores.push(p.data[i]);
                    }
                }
            }, function (errorPl) {
                console.log('Error al cargar los conductores de la central', errorPl);
            });
        }

        function remove(ruta, $index) {
            swal({
                title: 'ESTAS SEGURO!',
                text: 'Intentas remover este conductor de la ruta',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Remover',
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
                    swal.disableButtons();
                    Materialize.toast('Exito: Has removido al condcutor de la ruta', 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: 'Has removido al condcutor de la ruta',
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        vm.conductoresDeRuta.splice($index, 1);
                        updateTurnos(ruta, 'quitar');
                    // });
                }
            });
        }

        function selectConductor(conductor) {
            if (conductor.estado == 'En ruta') {
                Materialize.toast('Este conductor aun se encuentra en ruta', '5000', "rounded");
            } else {
                var nuevoTurno = {
                    'ruta_id': vm.selectedRuta.id,
                    'conductor_id': conductor.id,
                    'turno': vm.conductoresDeRuta.length + 1,
                    'conductor': conductor
                };
                vm.conductoresDeRuta.push(nuevoTurno);
                updateTurnos(vm.conductoresDeRuta);
                cargarRutas();
                $("#modalBuscarconductor").closeModal();
            }
        }

        function getCuposDisponiblesConductor(conductor_id) {
            newTurnosService.getCupos(conductor_id).then(succes, error);
            function succes(d) {
                vm.cupos = d.data;
            }

            function error(e) {

            }
        }

        function verVehiculo(conductor) {
            vm.conductor = conductor;
            vm.active = 'active';
            $('#modalVehiculo').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    cargarVehiculoConductor(vm.conductor.id);
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function getCliente(identificacion) {
            vm.cliente = {};
            newTurnosService.getCliente(identificacion).then(succes, error);
            function succes(p) {
                vm.cliente.id = p.data.id;
                //pasajeros
                vm.Pasajeros.nombre = p.data.nombres + ' ' + p.data.apellidos;
                vm.Pasajeros.telefono = p.data.telefono;
                vm.Newdireccion = p.data.direccion;
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

        // pasajeros
        function refrescarPasajeros(conductor_id) {
            // document.getElementById("guardar").disabled = false;
            // document.getElementById("actualizar").disabled = true;
            cargarPasajerosEnEspera();
            getCuposDisponiblesConductor(conductor_id);
            newTurnosService.refrescarPasajeros(conductor_id).then(success, error);
            function success(p) {
                vm.listaPasajeros = [];
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].estado == "Asignado" && p.data[i].conductor_id == conductor_id) {
                        vm.listaPasajeros.push(p.data[i]);
                        vm.Pasajeros = {};
                    } else {
                        console.log('algun error');
                    }
                }
            }

            function error(error) {
                console.log('error a traer la lista de pasajeros')
            }
        }

        function cargarPasajerosEnEspera() {
            document.getElementById("guardar").disabled = false;
            // document.getElementById("actualizar").disabled = true;
            pasajerosService.refrescarPasajeros().then(success, error);
            function success(p) {
                vm.listaPasajerosEspera = [];
                vm.Pasajeros = {};

                angular.forEach(p.data, function (pasajero) {
                    vm.listaPasajerosEspera.push(pasajero);
                })
            }

            function error(error) {
                console.log('error a traer la lista de pasajeros')
            }
        }

        function addPasajero(conductor) {
            vm.Pasajeros = {};
            vm.conductor = conductor;
            $('#modalAddPasajero').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    refrescarPasajeros(vm.conductor.id);
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        function asignarSolicitudPasajero() {
            var object = {
                central_id: authService.currentUser().central.id,
                tipo: 'pasajero',
                pasajeros: vm.Pasajeros,
                ruta_id: vm.selectedRuta.id,
                ciudad_direccion: authService.currentUser().central.ciudad.nombre,
                direccion_recogida: vm.Newdireccion
            }
            newTurnosService.asignarSolicitudPasajero(object).then(success, error);
            function success(p) {
                vm.Pasajeros = {};
                vm.Newdireccion = '';
                cargarSolicitudesDeRuta(vm.selectedRuta.id);
                Materialize.toast('Se guardo en espera al pasajero correctamente !', 8000);
                // $('#modalNewSolicitudPasajero').closeModal();
            }

            function error(e) {
                Materialize.toast(e.menssage, 4000);
            }
        }

        function addNewSolicitudPasajero(ruta) {
            if (!vm.selectedRuta) {

            } else {
                vm.selectedRuta = ruta;
                $('#modalNewSolicitudPasajero').openModal({
                    dismissible: false, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    in_duration: 400, // Transition in duration
                    out_duration: 300, // Transition out duration
                    ready: function () {
                        document.getElementById("guardar").disabled = false;
                        // document.getElementById("actualizar").disabled = true;
                        vm.Pasajeros = {};
                        vm.Newdireccion = '';
                    }, // Callback for Modal open
                    //complete: function() { alert('Closed'); } // Callback for Modal close
                });
            }
        }

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
                    newTurnosService.eliminarPasajero(pasajero_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: Pasajero retirado correctamente', 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: 'Pasajero retirado correctamente',
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarPasajeros(vm.conductor.id);
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo retirar al pasajero seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo retirar al pasajero seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        vm.modalMovePasajero = function (pasajero) {
            vm.pasajero = pasajero;
            $('#modalMovePasajero').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    newTurnosService.cargarTurnosC().then(function (p) {
                        vm.crutas = p.data;
                    });
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        vm.asigarPasajeroConductor = function (pasajero_id, conductor_id) {
            var obj = {
                conductor_id: conductor_id
            }
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado asignar este pasajero al conductor escogido!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Mover',
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
                    newTurnosService.moverPasajero(pasajero_id, obj).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: ' + p.data.message, 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: p.data.message,
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarPasajeros(vm.conductor.id);
                        cargarPasajerosEnEspera();
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo asignar pasajero seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo asignar pasajero seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        vm.moverPasajero = function (pasajero_id, conductor_id) {
            var obj = {
                conductor_id: conductor_id
            }
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado mover un pasajero hacia otro conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Mover',
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
                    newTurnosService.moverPasajero(pasajero_id, obj).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: ' + p.data.message, 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: p.data.message,
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarPasajeros(vm.conductor.id);
                        cargarPasajerosEnEspera();
                        $('#modalMovePasajero').closeModal();
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo mover pasajero seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo mover pasajero seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        };
        // fin pasajeros

        //GIROS
        function refrescarGiros(conductor_id) {
            document.getElementById("guardarG").disabled = false;
            document.getElementById("actualizarG").disabled = true;
            newTurnosService.refrescarGiros(conductor_id).then(success, error);
            function success(p) {
                vm.listaGiros = [];
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].estado == "En espera") {
                        vm.listaGiros.push(p.data[i]);
                        vm.Giros = {};
                    } else {
                        console.log('algun error');
                    }
                }
            }

            function error(error) {
                console.log('error a traer la lista de pasajeros')
            }
        }

        function addGiro(conductor) {
            vm.Giros = {};
            vm.conductor = conductor;
            refrescarGiros(vm.conductor.id);
            $('#modalAddGiro').openModal();
        }

        function asignarGiro() {
            vm.Giros.cliente_id = vm.cliente.id;
            vm.Giros.conductor_id = vm.conductor.id;
            newTurnosService.asignarGiro(vm.Giros).then(success, error);
            function success(p) {
                Materialize.toast(p.data.message, '5000', "rounded");
                refrescarGiros(vm.conductor.id);
            }

            function error(error) {
                console.log('Error al guardar')
            }
        }

        function cargarModificarGiro(item) {
            document.getElementById("actualizarG").disabled = false;
            document.getElementById("guardarG").disabled = true;
            vm.Giros = item;
        };

        function modificarGiro() {
            newTurnosService.modificarGiro(vm.Giros.id, vm.Giros).then(success, error);
            function success(p) {
                Materialize.toast(p.data.message, '5000', "rounded");
                refrescarGiros(vm.conductor.id);
                document.getElementById("guardarG").disabled = false;
                document.getElementById("actualizarG").disabled = true;
            }

            function error(error) {
                console.log('Error al guardar')
            }
        };

        vm.modalMoveGiro = function (giro) {
            vm.giro = giro;
            $('#modalMoveGiro').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    newTurnosService.cargarTurnosC().then(function (p) {
                        vm.crutas = p.data;
                    });
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        vm.moverGiro = function (giro_id, conductor_id) {
            var obj = {
                conductor_id: conductor_id
            }
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado mover un giro hacia otro conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Mover',
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
                    newTurnosService.moverGiro(giro_id, obj).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: '+p.data.message, 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: p.data.message,
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarGiros(vm.conductor.id);
                        $('#modalMoveGiro').closeModal();
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo mover giro seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo mover giro seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        function eliminarGiro(giro_id) {
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado retirar un giro designado al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Eliminar',
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
                    newTurnosService.eliminarGiro(giro_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: Giro retirado correctamente', 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: 'Giro retirado correctamente',
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                    //     refrescarGiros(vm.conductor.id);
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo retirar giro seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo retirar giro seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        //FIN GIROS

        //PAQUETES
        function refrescarPaquetes(conductor_id) {
            document.getElementById("guardarP").disabled = false;
            document.getElementById("actualizarP").disabled = true;
            newTurnosService.refrescarPaquetes(conductor_id).then(success, error);
            function success(p) {
                vm.listaPaquetes = [];
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].estado == "En espera") {
                        vm.listaPaquetes.push(p.data[i]);
                        vm.Paquetes = {};
                    } else {
                        console.log('algun error');
                    }
                }
            }

            function error(error) {
                console.log('error a traer la lista de paquetes')
            }
        }

        function addPaquete(conductor) {
            vm.Paquetes = {};
            vm.conductor = conductor;
            refrescarPaquetes(vm.conductor.id);
            $('#modalAddPaquetes').openModal();
        }

        function asignarPaquete() {
            vm.Paquetes.cliente_id = vm.cliente.id;
            vm.Paquetes.conductor_id = vm.conductor.id;
            newTurnosService.asignarPaquete(vm.Paquetes).then(success, error);
            function success(p) {
                refrescarPaquetes(vm.conductor.id);
                cargarSolicitudesDeRuta(vm.selectedRuta.id);
                Materialize.toast(p.data.message, '5000', 'rounded');
            }

            function error(error) {
                console.log('Error al guardar')
            }
        }

        function cargarModificarPaquete(item) {
            document.getElementById("actualizarP").disabled = false;
            document.getElementById("guardarP").disabled = true;
            vm.Paquetes = item;
        };

        function modificarPaquete() {
            newTurnosService.modificarPaquete(vm.Paquetes.id, vm.Paquetes).then(success, error);
            function success(p) {
                Materialize.toast(p.data.message, '5000', 'rounded');
                refrescarPaquetes(vm.conductor.id);
                document.getElementById("guardarP").disabled = false;
                document.getElementById("actualizarP").disabled = true;
            }

            function error(error) {
                console.log('Error al guardar')
            }
        };

        function verDescripcionPaquete(paquete) {
            vm.Paquete = paquete;
            $('#modalDescripcionPaquete').openModal();
        }

        vm.modalMovePaquete = function (paquete) {
            vm.paquete = paquete;
            $('#modalMovePaquete').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 400, // Transition in duration
                out_duration: 300, // Transition out duration
                ready: function () {
                    newTurnosService.cargarTurnosC().then(function (p) {
                        vm.crutas = p.data;
                    });
                }, // Callback for Modal open
                //complete: function() { alert('Closed'); } // Callback for Modal close
            });
        }

        vm.moverPaquete = function (paquete_id, conductor_id) {
            var obj = {
                conductor_id: conductor_id
            }
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado mover un paquete hacia otro conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Mover',
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
                    newTurnosService.moverPaquete(paquete_id, obj).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: '+p.data.message, 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: p.data.message,
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarPaquetes(vm.conductor.id);
                        $('#modalMovePaquete').closeModal();
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo mover paquete seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo mover paquete seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        function eliminarPaquete(paquete_id) {
            swal({
                title: 'ESTAS SEGURO?',
                text: 'Estas intentado retirar un paquete designado al conductor!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Eliminar',
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
                    newTurnosService.eliminarPaquete(paquete_id).then(succes, error);
                    swal.disableButtons();
                }
                function succes(p) {
                    Materialize.toast('Exito: Paquete retirado correctamente', 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: 'Paquete retirado correctamente',
                    //     type: 'success',
                    //     showCancelButton: false,
                    // }).then(function () {
                        refrescarPaquetes(vm.conductor.id);
                    // })
                }

                function error(error) {
                    Materialize.toast('Error: No se pudo retirar paquete seleccionado', 8000);
                    // swal({
                    //     title: 'Error!',
                    //     text: 'No se pudo retirar paquete seleccionado',
                    //     type: 'error',
                    //     showCancelButton: false,
                    // }).then(function () {
                    // })
                }
            });
        }

        //FIN PAQUETES

        function getSolicitudPasajero(solicitud_id) {
            vm.solicitud = [];
            $('#modalSolicitud').openModal();
            newTurnosService.getSolicitudPasajero(solicitud_id).then(success, error);
            function success(p) {
                vm.solicitud = p.data;

            }

            function error(e) {
                console.log('Error al cargar la solicitud');
            }
        }

        function getSolicitudPaquete(solicitud_id) {
            vm.solicitud = [];
            vm.conductores = {}
            $('#modalSolicitudPG').openModal();
            newTurnosService.getSolicitudPaquete(solicitud_id).then(success, error);
            function success(p) {
                vm.solicitud = p.data;

            }

            function error(e) {
                console.log('Error al cargar la solicitud', e);
            }
        }

        function getSolicitudGiro(solicitud_id) {
            vm.solicitud = [];
            vm.conductores = {}
            $('#modalSolicitudPG').openModal();
            newTurnosService.getSolicitudGiro(solicitud_id).then(success, error);
            function success(p) {
                vm.solicitud = p.data;

            }

            function error(e) {
                console.log('Error al cargar la solicitud');
            }

        }

        vm.recharSolicitud = function () {
            swal({
                title: 'Escriba la causa de rechazo',
                html: '<textarea style="padding-left: 30px" id="causa" class="materialize-textarea" placeholder="Escriba aqui la causa de rechazo para esta solicitud." ng-model="vm.causa_rechazo"></textarea><label for="textarea1">Causa de rechazo</label>',
                showCancelButton: true,
                confirmButtonColor: '#9ccc65',
                cancelButtonColor: '#D50000',
                confirmButtonText: 'Rechazar',
                cancelButtonText: 'Cancelar rechazo',
                closeOnConfirm: false,
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
                var obj = {
                    causa_rechazo: $('#causa').val()
                }
                if (isConfirm) {
                    newTurnosService.rechazarSolicitud(obj, vm.solicitud.id).then(succes, error);
                }
                function succes(p) {
                    swal.disableButtons();
                    Materialize.toast('Exito: '+p.data.message, 8000);
                    // swal({
                    //     title: 'Exito!',
                    //     text: p.data.message,
                    //     type: 'success',
                    // }).then(function () {
                        cargarRutas();
                    // });
                }

                function error(error) {
                    Materialize.toast('Error: '+error.data.message, 8000);
                    // swal(
                    //     'ERROR!!',
                    //     error.data.message,
                    //     'error'
                    // );
                }
            })
        }

        vm.selectCsolicitud = function (solicitud_id, conductor_id) {
            newTurnosService.getCupos(conductor_id).then(function (p) {
                console.log(vm.solicitud)
                if (vm.solicitud.tipo == 'vehiculo' && p.data < vm.solicitud.datos_pasajeros.length) {
                    Materialize.toast('El conductor tiene ' + p.data + ' cupo(s) disponible(s), ud esta necesitando ' + vm.solicitud.datos_pasajeros.length + ' cupo(s) disponible(s)', '5000', 'rounded')
                } else if (vm.solicitud.tipo == 'pasajero' && p.data < vm.solicitud.datos_pasajeros.length) {
                    Materialize.toast('El conductor tiene ' + p.data + ' cupo(s) disponible(s), ud esta necesitando ' + vm.solicitud.datos_pasajeros.length + ' cupo(s) disponible(s)', '5000', 'rounded')
                } else {
                    swal({
                        title: 'ESPERA UN MOMENTO!',
                        text: 'Seguro quieres asigarle este pedido al conductor?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#9ccc65',
                        cancelButtonColor: '#D50000',
                        confirmButtonText: 'Asignar',
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
                            var obj = {
                                conductor_id: conductor_id
                            }
                            newTurnosService.asignarSolicitud(solicitud_id, obj).then(succes, error);
                        }
                        function succes(p) {
                            swal.disableButtons();
                            Materialize.toast('Exito: '+p.data.message, 8000);
                            // swal({
                            //     title: 'Exito!',
                            //     text: p.data.message,
                            //     type: 'success',
                            // }).then(function () {
                                cargarRutas();
                            // });
                            $('#modalSolicitud').closeModal();
                            $('#modalSolicitudPG').closeModal();

                        }

                        function error(error) {
                            Materialize.toast('Error: '+error.data.message, 8000);
                            // swal(
                            //     'ERROR!!',
                            //     error.data.message,
                            //     'error'
                            // );
                        }
                    });
                }
            }, function error(e) {

            });
        };

        function limpiarPasajeros() {
            document.getElementById("guardar").disabled = false;
            // document.getElementById("actualizar").disabled = true;
            // refrescarPasajeros(conductor_id)
            vm.Pasajeros = {};
            vm.Newdireccion = '';
        };

        function limpiarGiros(conductor_id) {
            document.getElementById("guardarG").disabled = false;
            document.getElementById("actualizarG").disabled = true;
            refrescarGiros(conductor_id)
            vm.Giros = "";
        };

        function limpiarPaquetes(conductor_id) {
            document.getElementById("guardarP").disabled = false;
            document.getElementById("actualizarP").disabled = true;
            refrescarPaquetes(conductor_id)
            vm.Paquetes = "";
        };

        itemActionChannel.bind("NuevaSolicitudEvent", function (data) {
            if (authService.currentUser().central.id == data.central_id) {
                cargarRutas();
            }
        });

        itemActionChannel.bind("ModificarSolicitudEvent", function (data) {
            if (authService.currentUser().central.id == data.central_id) {
                cargarRutas();
            }
        });

        itemActionChannel.bind("CancelarSolicitudEvent", function (data) {
            if (authService.currentUser().central.id == data.central_id) {
                cargarRutas();
            }
        });

        vm.despacharEsteConductor = function () {
            var obj = {
                ruta: vm.selectedRuta,
                conductor: vm.conductorSelected.conductor,
                deducciones: vm.Deducciones
            };
            vm.ruta = vm.selectedRuta;
            newTurnosService.getCupos(obj.conductor.id).then(function (p) {
                if (p.data != 0) {
                    swal({
                        title: 'ESPERA UN MOMENTO!',
                        text: 'El conductor <b>' + obj.conductor.nombres + ' ' + obj.conductor.apellidos + '</b> aun tiene cupos disponibles',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#9ccc65',
                        cancelButtonColor: '#D50000',
                        confirmButtonText: 'Despachar',
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
                    }).then(despachar);
                } else {
                    swal({
                        title: '',
                        text: 'ESTA A PUNTO DE DESPACHAR AL CONDUCTOR <b>' + (obj.conductor.nombres + ' ' + obj.conductor.apellidos).toUpperCase() + '</b>',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Despachar',
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
                    }).then(despachar);
                }
                function despachar(isConfirm) {
                    if (isConfirm) {
                        newTurnosService.despacharUnConductor(obj).then(succes, error);
                    }
                    function succes(p) {

                        vm.conductoresDeRuta.splice(vm.indexConductor, 1);
                        updateTurnos(vm.ruta, 'quitar');
                        swal.disableButtons();
                        swal({
                            title: 'Exito!',
                            text: 'El coductor ha sido despachado exitosamete',
                            type: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#9ccc65',
                            cancelButtonColor: '#D50000',
                            confirmButtonText: 'Mostrar planilla',
                            cancelButtonText: 'Cerrar',
                            closeOnConfirm: true
                        }).then(function (IsComfirm) {
                            if (IsComfirm) {
                                if (p.data.tipo == 'especial') {
                                    cargarDatosPlanillaEspecial(p.data.central_id, p.data.id)
                                } else {
                                    cargarDatosPlanillaNormal(p.data.central_id, p.data.id)
                                }
                                cargarRutas();
                            }
                        });
                        vm.conductorSelected = null;
                        vm.indexConductor = null;
                    }

                    function error(error) {
                        Materialize.toast('Error: Ocurrio un error al despachar el conductor', 8000);
                        // swal(
                        //     'ERROR!!',
                        //     'Ocurrio un error al despachar el conductor)',
                        //     'error'
                        // );
                    }
                };
            });
        };

        function cargarDatosPlanillaEspecial(central_id, planilla_id) {
            newTurnosService.obtenerDatosPlanillas(central_id, planilla_id).then(success, error);
            function success(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                if (response.data.tipo == 'especial') {
                    $('#modalPlanillaEspecial').openModal();
                } else {
                    newTurnosService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
                }
                function successN(response) {
                    vm.planilla = {};
                    vm.planilla = response.data;
                    $('#modalPlanillaNormal').openModal();
                }

                function errorN(response) {
                    console.log('Ocurrio un error !');
                }
            }

            function error(response) {
                console.log('Ocurrio un error !');
            }
        }

        function cargarDatosPlanillaNormal(central_id, planilla_id) {
            newTurnosService.obtenerDatosPlanillasNormal(central_id, planilla_id).then(successN, errorN);
            function successN(response) {
                vm.planilla = {};
                vm.planilla = response.data;
                $('#modalPlanillaNormal').openModal();
            }

            function errorN(response) {
                console.log('Ocurrio un error !');
            }
        }

        function cargarDeducciones() {
            var promiseGet = planillasService.getDeducciones();
            promiseGet.then(function (p) {
                vm.Deducciones = [];
                for (var i = 0; i < p.data.length; i++) {
                    if (p.data[i].estado == true) {
                        vm.Deducciones.push(p.data[i]);
                    } else {
                        console.log('algun error');
                    }
                }
            }, function (errorPl) {
                console.log('Error Al Cargar Datos', errorPl);
            });
        }

        vm.imprimir = function () {
            var headstr = "<html ><head><title>Imprimir</title></head><body style='color: white'>";
            var footstr = "</body>";
            var newstr = document.getElementById('contenidoplanillaespecial').innerHTML;
            var oldstr = document.body.innerHTML;
            document.body.innerHTML = headstr + newstr + footstr;
            window.print();
            window.close();
            // document.body.innerHTML = oldstr;
            location.reload();
        }

        init();
    }
})();
