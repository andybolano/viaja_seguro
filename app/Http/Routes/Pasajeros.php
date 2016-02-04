<?php

Route::get('/api/centrales/{conductor_id}/pasajeros', 'Central\PasajeroController@index');
Route::post('/api/centrales/{conductor_id}/pasajeros', 'Central\PasajeroController@store');
Route::get('/api/pasajeros/{pasajero_id}', 'Central\PasajeroController@show');
Route::put('/api/pasajeros/{pasajeros_id}', 'Central\PasajeroController@update');
Route::delete('/api/pasajeros/{pasajeros_id}', 'Central\PasajeroController@destroy');