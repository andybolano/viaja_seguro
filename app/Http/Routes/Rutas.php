<?php
Route::post('/api/empresas/{empresa_id}/rutas', 'Empresa\RutasController@store');
Route::delete('/api/rutas/{ruta_id}', 'Empresa\RutasController@destroy');