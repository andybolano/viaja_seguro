<?php
Route::get('/api/centrales/{central_id}/giros', 'Central\GiroController@index');
Route::post('/api/centrales/{central_id}/giros', 'Central\GiroController@store');
Route::put('/api/giros/{giro_id}', 'Central\GiroController@update');
Route::delete('/api/giros/{giro_id}', 'Central\GiroController@destroy');

Route::put('/api/centrales/giros/{giro_id}/mover', 'Central\GiroController@moverGiro');