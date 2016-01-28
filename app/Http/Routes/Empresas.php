<?php
//Route::get('/api/empresas', 'SuperAdmin\EmpresaController@index');
Route::get('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@show');
Route::post('/api/empresas', 'SuperAdmin\EmpresaController@store');
Route::post('/api/empresas/{empresa_id}/logo', 'SuperAdmin\EmpresaController@saveLogo');
Route::put('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@update');
Route::delete('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@destroy');

Route::get('/api/empresas/{empresa_id}/vehiculos', 'SuperAdmin\EmpresaController@getVehiculos');
Route::get('/api/empresas/{empresa_id}/conductores', 'SuperAdmin\EmpresaController@getConductores');
Route::post('/api/empresas/{empresa_id}/conductores', 'SuperAdmin\EmpresaController@storeConductor');

Route::get('/api/empresas/{empresa_id}/rutas', 'SuperAdmin\EmpresaController@getRutas');