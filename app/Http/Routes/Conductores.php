<?php
Route::get('/api/centrales/{central_id}/conductores/disponibles', 'Empresa\ConductorController@cdisponibles');
Route::get('/api/centrales/{central_id}/conductores/ausentes', 'Empresa\ConductorController@causentes');
Route::get('/api/centrales/{central_id}/conductores/buscandopasajeros', 'Empresa\ConductorController@bpasajeros');
Route::get('/api/rutas/{ruta_id}/conductores/en_turno', 'Empresa\ConductorController@cantidadturnos');

//Route::post('/api/empresas/{empresa_id}/conductores','Empresa\ConductorController@store');
Route::get('/api/conductores/rutas/{ruta_id}/ubicacion', 'Empresa\ConductorController@getUbicacion');
Route::get('/api/conductores/{conductor_id}', 'Empresa\ConductorController@show');
Route::post('/api/conductores/{conductor_id}/imagen', 'Empresa\ConductorController@guardaImagen');
Route::put('/api/conductor/{conductor_id}', 'Empresa\ConductorController@update');
Route::delete('/api/conductor/{conductor_id}', 'Empresa\ConductorController@destroy');
Route::get('/api/conductores/{conductor_id}/vehiculo', 'Empresa\ConductorController@getVehiculo');
Route::post('/api/conductores/{conductor_id}/vehiculo', 'Empresa\ConductorController@postVehiculo');

Route::post('/api/conductores/{conductor_id}/ubicacion', 'Empresa\ConductorController@postUbicacion');

Route::get('/api/conductores/ruta/{ruta_id}', 'SuperAdmin\EmpresaController@getConductoresEnRuta');

Route::put('/api/conductores/{conductor_id}/reg_id/{reg_id}', 'Empresa\ConductorController@updateRegId');

Route::get('/api/conductores/{conductor_id}/cupos', 'Empresa\ConductorController@getCupos');

Route::delete('/api/conductores/{conductor_id}/ubicacion', 'Empresa\ConductorController@deleteUbicacion');
Route::get('/api/conductores/{conductor_id}/ubicacion', 'Empresa\ConductorController@getUbicacionConductor');

Route::get('/api/conductores/{conductor_id}/incidencias', 'Empresa\ConductorController@getIncidencias');
Route::post('/api/conductores/{conductor_id}/incidencias', 'Empresa\ConductorController@storeIncidencia');
Route::get('/api/conductores/{conductor_id}/incidencias/ultima', 'Empresa\ConductorController@UltimaIncidencias');
Route::put('/api/conductores/{conductor_id}/incidencias/{incidencia_id}', 'Empresa\ConductorController@finalizarIncidencia');

Route::post('/api/conductores/notificar/busqueda/cliente', 'Empresa\ConductorController@enviarNotificacionBusquedaClientes');
Route::post('/api/conductores/notificar/busqueda/encomienda/cliente', 'Empresa\ConductorController@enviarNotificacionBusquedaGirosPaquetes');
Route::post('/api/conductores/finalizar/busqueda/pgp', 'Empresa\ConductorController@finalizarBusquedaPGP');
Route::post('/api/conductores/finalizar/viaje', 'Empresa\ConductorController@finalizarViaje');