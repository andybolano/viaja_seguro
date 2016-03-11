<?php

Route::get('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@index');
Route::post('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@store');
Route::put('/api/centrales/{central_id}', 'Empresa\CentralesController@update');
Route::delete('/api/centrales/{central_id}', 'Empresa\CentralesController@destroy');

Route::get('/api/centrales/{central_id}/vehiculos', 'Empresa\CentralesController@getVehiculos');
Route::get('/api/centrales/{central_id}/conductores', 'Empresa\CentralesController@getConductores');

Route::get('/api/centrales/{central_id}/rutas', 'Empresa\CentralesController@getRutas');

Route::get('/api/centrales/{central_id}/solicitudes_pasajeros', 'Empresa\CentralesController@getSolicitudesPasajeros');

Route::get('/api/centrales/solicitudes_pasajeros/{pasajero_id}', 'Empresa\CentralesController@getSolicitudPasajero');
Route::put('/api/centrales/solicitudes/{solicitud_id}/rechazo', 'Empresa\CentralesController@rechazarSolicitud');
Route::put('/api/centrales/solicitudes/{solicitud_id}/aceptar', 'Empresa\CentralesController@aceptarSolicitudPasajero');