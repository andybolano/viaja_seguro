<?php

Route::get('/api/centrales/conductor/{conductor_id}/pasajeros', 'Central\PasajeroController@index');
Route::get('/api/centrales/{central_id}/pasajeros', 'Central\PasajeroController@obtenerPasajerosCentral');
Route::post('/api/centrales/{conductor_id}/pasajeros', 'Central\PasajeroController@store');
Route::get('/api/pasajeros/{pasajero_id}', 'Central\PasajeroController@show');
Route::put('/api/pasajeros/{pasajero_id}', 'Central\PasajeroController@update');
Route::delete('/api/pasajeros/{pasajero_id}', 'Central\PasajeroController@destroy');

Route::put('/api/centrales/pasajeros/{pasajero_id}/mover', 'Central\PasajeroController@moverPasajero');