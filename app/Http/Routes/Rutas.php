<?php
Route::post('/api/rutas', 'Empresa\RutasController@store');
Route::delete('/api/rutas/{ruta_id}', 'Empresa\RutasController@destroy');