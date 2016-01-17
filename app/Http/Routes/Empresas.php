<?php

Route::resource('/api/empresas', 'SuperAdmin\EmpresaController');
Route::post('/api/empresas/{id}/logo', 'SuperAdmin\EmpresaController@saveLogo');

Route::resource('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController');

//pasajeros//
Route::get('/api/empresa/obtener/pasajeros', 'Empresa\ServiciosController@getPasajeros');
Route::post('/api/empresa/pasajeros', 'Empresa\ServiciosController@postPasajero');
Route::put('/api/empresa/pasajeros/{id}', 'Empresa\ServiciosController@putPasajero');
Route::delete('/api/empresa/pasajeros/{id}', 'Empresa\ServiciosController@deletePasajero');
///


//giros//
Route::get('/api/empresa/obtener/giros', 'Empresa\ServiciosController@getGiros');
//

//paquetes//
Route::get('/api/empresa/obtener/paquetes', 'Empresa\ServiciosController@getPaquetes');
//