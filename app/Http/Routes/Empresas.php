<?php

Route::resource('/api/empresas', 'SuperAdmin\EmpresaController');
Route::post('/api/empresas/{codigo}/logo', 'SuperAdmin\EmpresaController@saveLogo');

Route::resource('/api/empresas/{id}/centrales', 'Empresa\CentralesController');

Route::get('/api/empresa/obtener/pasajeros', 'Empresa\ServiciosController@getPasajeros');
Route::get('/api/empresa/obtener/giros', 'Empresa\ServiciosController@getGiros');
Route::get('/api/empresa/obtener/paquetes', 'Empresa\ServiciosController@getPaquetes');