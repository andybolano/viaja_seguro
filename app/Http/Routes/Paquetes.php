<?php
Route::get('/api/centrales/{central_id}/paquetes', 'Central\PaqueteController@index');
Route::post('/api/centrales/{central_id}/paquetes', 'Central\PaqueteController@store');
Route::put('/api/paquetes/{paquete_id}', 'Central\PaqueteController@update');
Route::delete('/api/paquetes/{paquete_id}', 'Central\PaqueteController@destroy');