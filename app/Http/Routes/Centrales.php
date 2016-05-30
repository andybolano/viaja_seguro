<?php

Route::get('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@index');
Route::post('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@store');
Route::put('/api/centrales/{central_id}', 'Empresa\CentralesController@update');
Route::delete('/api/centrales/{central_id}', 'Empresa\CentralesController@destroy');

Route::get('/api/centrales/{central_id}/vehiculos', 'Empresa\CentralesController@getVehiculos');
Route::get('/api/centrales/{central_id}/conductores', 'Empresa\CentralesController@getConductores');
Route::get('/api/centrales/{central_id}/rutas/conductorEnTurno', 'Empresa\CentralesController@getConductoresEnRuta');

Route::get('/api/centrales/{central_id}/rutas', 'Empresa\CentralesController@getRutas');

Route::get('/api/centrales/{central_id}/solicitudes_pasajeros', 'Empresa\CentralesController@getSolicitudesPasajeros');
Route::get('/api/centrales/{central_id}/solicitudes_paquetes', 'Empresa\CentralesController@getSolicitudesPaquetes');
Route::get('/api/centrales/{central_id}/solicitudes_giros', 'Empresa\CentralesController@getSolicitudesGiros');

Route::get('/api/centrales/solicitudes_pasajeros/{solicitud_id}', 'Empresa\CentralesController@getSolicitudPasajero');
Route::get('/api/centrales/solicitudes_paquetes/{solicitud_id}', 'Empresa\CentralesController@getSolicitudPaquete');
Route::get('/api/centrales/solicitudes_giros/{solicitud_id}', 'Empresa\CentralesController@getSolicitudGiro');
Route::put('/api/centrales/solicitudes/{solicitud_id}/rechazo', 'Empresa\CentralesController@rechazarSolicitud');
Route::put('/api/centrales/solicitudes/{solicitud_id}/aceptar', 'Empresa\CentralesController@aceptarSolicitudPasajero');

Route::get('/api/centrales/{central_id}/deducciones', 'Empresa\CentralesController@getDeducciones');
Route::post('/api/centrales/{central_id}/deducciones', 'Empresa\CentralesController@setDeducciones');
Route::get('/api/centrales/{central_id}/total_deducciones/{dia}', 'Empresa\CentralesController@getTotalDeducciones');

Route::post('/api/centrales/solicitud/new_pasajeros', 'Empresa\CentralesController@addNewSolicitudPasajero');