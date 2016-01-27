<?php

Route::get('/api/centrales/{central_id}/pasajeros', 'Central\PasajeroController@index');
Route::post('/api/centrales/{central_id}/pasajeros', 'Central\PasajeroController@store');
Route::put('/api/pasajeros/{pasajeros_id}', 'Central\PasajeroController@update');
Route::delete('/api/pasajeros/{pasajeros_id}', 'Central\PasajeroController@destroy');