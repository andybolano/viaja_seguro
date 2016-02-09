/**
 * Created by tav0 on 12/01/16.
 */
app.controller('TurnosController', TurnosController);

function TurnosController($scope, turnosService, serviceEmpresaPagos){
    cargarDeducciones();
    $scope.conductores = [];
    $scope.selectedTurno = {};
    $scope.rutas = [];
    $scope.selectedRuta = {};

    $scope.addNewConductor = addNewConductor;
    $scope.selectConductor = selectConductor;
    $scope.remove = remove;
    $scope.movedConductor = movedConductor;
    $scope.addConductor = addConductor;
    $scope.updateTurnos = updateTurnos;
    $scope.addPasajero = addPasajero;
    $scope.addGiro = addGiro;
    $scope.addPaquete = addPaquete;

    function addNewConductor(ruta){
        $scope.selectedRuta = ruta;
        cargarConductores();
        $("#modalBuscarconductor").openModal();
    }

    function selectConductor (conductor){
        var nuevoTurno = {
            'ruta_id': $scope.selectedRuta.id,
            'conductor_id': conductor.id,
            'turno': $scope.selectedRuta.turnos.length+1,
            'conductor': conductor
        };
        $scope.selectedRuta.turnos.push(nuevoTurno);
        updateTurnos($scope.selectedRuta);
        $("#modalBuscarconductor").closeModal();
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

    cargarRutas();
    function cargarRutas() {
        turnosService.getRutasCentral().then(success, error);
        function success(p) {
            $scope.rutas = p.data;
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }

    function cargarConductores() {
        turnosService.getAllConductores().then(success, error);
        function success(p) {
            for(var i=0; i<p.data.length; i++){
                if(p.data[i].activo == true ){
                    $scope.Conductores.push(p.data[i]);
                }else{
                    $scope.ConductoresInactivos.push(p.data[i]);
                }
            }
        }
        function error(error) {
            console.log('Error al cargar conductores', error);
        }
    }

    function cargarVehiculoConductor(conductor_id){
        turnosService.cargarVehiculoConductor(conductor_id).then(success, error);
        function success(p) {
            $scope.vehiculo = p.data;
        }
        function error(error) {
            console.log('Error los datos del vehiculo', error);
        }
    }

    //SERVICIOS
    $scope.Pasajeros = {};
    $scope.Paquetes = {};
    $scope.Giros = {};
    $scope.listaPasajeros = {};
    $scope.listaPaquetes = {};
    $scope.listaGiros = {};

    ///pasajeros
    function refrescarPasajeros(conductor_id){
        document.getElementById("guardar").disabled = false;
        document.getElementById("actualizar").disabled = true;
        turnosService.refrescarPasajeros(conductor_id).then(success, error);
        function  success(p){
            $scope.listaPasajeros = p.data;
            $scope.Pasajeros = "";
        }
        function error(error){
            console.log('error a traer la lista de pasajeros')
        }
    }

    $scope.verVehiculo = function(conductor){
        $scope.conductor = conductor;
        $scope.active = 'active';
        cargarVehiculoConductor($scope.conductor.id);
        $('#modalVehiculo').openModal();
    }

    function addPasajero(conductor){
        $scope.conductor = conductor;
        cargarVehiculoConductor($scope.conductor.id);
        refrescarPasajeros($scope.conductor.id);
        $('#modalAddPasajero').openModal();
    }

    $scope.asignarPasajero = function(){
        $scope.Pasajeros.conductor_id = $scope.conductor.id;
        if($scope.vehiculo.cupos == 0){
            Materialize.toast('Este conductor no tiene cupos disponibles','5000',"rounded");
        }else{
            turnosService.asignarPasajero($scope.Pasajeros).then(success, error);
            function  success(p){
                $scope.vehiculo.cupos = $scope.vehiculo.cupos-1;
                var obj = {
                    cupos : $scope.vehiculo.cupos
                }
                turnosService.updateCuposVehiculo($scope.vehiculo.id, obj);
                refrescarPasajeros($scope.conductor.id);
            }
            function error(error){
                console.log('Error al guardar')
            }
        }
    }

    $scope.cargarModificarPasajero = function(item){
        document.getElementById("actualizar").disabled = false;
        document.getElementById("guardar").disabled = true;
        $scope.Pasajeros = item;
    };

    $scope.modificarPasajero = function(){
        turnosService.modificarPasajero($scope.Pasajeros.id, $scope.Pasajeros).then(success, error);
        function  success(p){
            Materialize.toast(p.message,'5000',"rounded");
            refrescarPasajeros($scope.conductor.id);
            document.getElementById("guardar").disabled = false;
            document.getElementById("actualizar").disabled = true;
        }
        function error(error){
            console.log('Error al guardar')
        }
    };

    $scope.eliminarPasajero = function(pasajero_id){
        turnosService.eliminarPasajero(pasajero_id).then(succes, error);
        function succes(p){
            refrescarPasajeros($scope.conductor.id);
            Materialize.toast(p.message, '5000', 'rounded');
            $scope.vehiculo.cupos = $scope.vehiculo.cupos+1;
            var obj = {
                cupos : $scope.vehiculo.cupos
            }
            turnosService.updateCuposVehiculo($scope.vehiculo.id, obj);
        }
        function error(error){
            console.log('error al eliminar')
        }
    }

    ////Giros
    function refrescarGiros(conductor_id){
        document.getElementById("guardarG").disabled = false;
        document.getElementById("actualizarG").disabled = true;
        turnosService.refrescarGiros(conductor_id).then(success, error);
        function  success(p){
            $scope.listaGiros = p.data;
            $scope.Giros = "";
        }
        function error(error){
            console.log('error a traer la lista de pasajeros')
        }
    }

    function addGiro(conductor){
        $scope.conductor = conductor;
        refrescarGiros($scope.conductor.id);
        $('#modalAddGiro').openModal();
    }

    $scope.asignarGiro = function(){
        $scope.Giros.conductor_id = $scope.conductor.id;
        turnosService.asignarGiro($scope.Giros).then(success, error);
        function  success(p){
            refrescarGiros($scope.conductor.id);
        }
        function error(error){
            console.log('Error al guardar')
        }
    }

    $scope.cargarModificarGiro = function(item){
        document.getElementById("actualizarG").disabled = false;
        document.getElementById("guardarG").disabled = true;
        $scope.Giros = item;
    };

    $scope.modificarGiro = function(){
        turnosService.modificarGiro($scope.Giros.id, $scope.Giros).then(success, error);
        function  success(p){
            Materialize.toast(p.message,'5000',"rounded");
            refrescarGiros($scope.conductor.id);
            document.getElementById("guardarG").disabled = false;
            document.getElementById("actualizarG").disabled = true;
        }
        function error(error){
            console.log('Error al guardar')
        }
    };

    $scope.eliminarGiro = function(giro_id){
        turnosService.eliminarGiro(giro_id).then(succes, error);
        function succes(p){
            refrescarGiros($scope.conductor.id);
            Materialize.toast(p.message, '5000', 'rounded');
        }
        function error(error){
            console.log('error al eliminar')
        }
    }

    ////Paquetes
    function refrescarPaquetes(conductor_id){
        document.getElementById("guardarP").disabled = false;
        document.getElementById("actualizarP").disabled = true;
        turnosService.refrescarPaquetes(conductor_id).then(success, error);
        function  success(p){
            $scope.listaPaquetes = p.data;
            $scope.Paquetes = "";
        }
        function error(error){
            console.log('error a traer la lista de paquetes')
        }
    }

    function addPaquete(conductor){
        $scope.conductor = conductor;
        refrescarPaquetes($scope.conductor.id);
        $('#modalAddPaquetes').openModal();
    }

    $scope.asignarPaquete = function(){
        $scope.Paquetes.conductor_id = $scope.conductor.id;
        turnosService.asignarPaquete($scope.Paquetes).then(success, error);
        function  success(p){
            refrescarPaquetes($scope.conductor.id);
        }
        function error(error){
            console.log('Error al guardar')
        }
    }

    $scope.cargarModificarPaquete = function(item){
        document.getElementById("actualizarP").disabled = false;
        document.getElementById("guardarP").disabled = true;
        $scope.Paquetes = item;
    };

    $scope.modificarPaquete = function(){
        turnosService.modificarPaquete($scope.Paquetes.id, $scope.Paquetes).then(success, error);
        function  success(p){
            Materialize.toast(p.message,'5000',"rounded");
            refrescarPaquetes($scope.conductor.id);
            document.getElementById("guardarP").disabled = false;
            document.getElementById("actualizarP").disabled = true;
        }
        function error(error){
            console.log('Error al guardar')
        }
    };

    $scope.verDescripcionPaquete = function(paquete){
        $scope.Paquete = paquete;
        $('#modalDescripcionPaquete').openModal();
    }

    $scope.eliminarPaquete = function(paquete_id){
        turnosService.eliminarPaquete(paquete_id).then(succes, error);
        function succes(p){
            refrescarPaquetes($scope.conductor.id);
            Materialize.toast(p.message, '5000', 'rounded');
        }
        function error(error){
            console.log('error al eliminar')
        }
    }

    ///
    $scope.limpiar = function(){
        document.getElementById("guardar").disabled = false;
        document.getElementById("actualizar").disabled = true;
        document.getElementById("guardarG").disabled = false;
        document.getElementById("actualizarG").disabled = true;
        document.getElementById("guardarP").disabled = false;
        document.getElementById("actualizarP").disabled = true;
        $scope.Pasajeros = "";
        $scope.Paquetes = "";
        $scope.Giros = "";
    };

    $scope.despacharConductor = function(ruta_id){
        $scope.turnos = {};
        turnosService.getTurno(ruta_id).then(succes, error);
        function succes(p){
            $scope.turnos = p.data;
            if($scope.turnos.turno == 1){
                ejecutarDespachoConductor($scope.turnos);
                Materialize.toast($scope.Planilla.message, 5000);
                $('#modalPlanilla').openModal();
            }

        }
        function error(error){
            Materialize.toast(error.message, 5000);
        }
    }

    function ejecutarDespachoConductor(datos){
        $scope.Planilla = {};
        var obj = {
            ruta_id : datos.ruta_id,
            turno : datos.turno,
            conductor_id : datos.conductor_id
        }
        turnosService.eliminarTurno(obj).then(succes, error);
        function succes(p){
            $scope.Planilla = p.data;
            console.log($scope.Planilla)
            cargarRutas();
            Materialize.toast(p.message, 5000);
        }
        function error(error){
            Materialize.toast(error.message, 5000);
        }
    }

    function cargarDeducciones(){
        var promiseGet = serviceEmpresaPagos.getDeducciones();
        promiseGet.then(function (pl) {
            $scope.Deducciones = pl.data;
        },function (errorPl) {
            console.log('Error Al Cargar Datos', errorPl);
        });
    }

    $scope.imprimir = function(){
        //var printContents = document.getElementById('planilla').innerHTML;
        //var popupWin = window.open('', 'popimpr');
        //popupWin.document.open();
        //popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="http://localhost:8080/viaja_seguro/public/css/pdf.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        //popupWin.document.close();


        var ficha = document.getElementById('planilla');
        var ventimp = window.open(' ', 'popimpr');
        ventimp.document.write( ficha.innerHTML );
        ventimp.document.close();
        var css = ventimp.document.createElement("link");
        css.setAttribute("href", "http://localhost:8080/viaja_seguro/public/css/pdf.css");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        ventimp.document.head.appendChild(css);
        ventimp.print( );
        ventimp.close();
        //var ventana = window.open(),
        //    css = document.createElement("style"),
        //    foo = document.querySelector("#planilla"),
        //    ajax = function(url, elem, callback){
        //        var xhr = new XMLHttpRequest();
        //        xhr.open("GET", url, true);
        //        xhr.send();
        //        xhr.addEventListener("load", function(){
        //            if (this.status == 200){
        //                elem.innerHTML = this.responseText;
        //                callback();
        //            }
        //        }, false);
        //    };
        //
        //ajax("../css/pdf.css", css, function(){
        //    ventana.document.body.appendChild(css);
        //    ventana.document.body.appendChild(foo);
        //    ventana.print();
        //});
    }

}
