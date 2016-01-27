<?php
Route::resource('/api/empresas', 'SuperAdmin\EmpresaController');


Route::post('/api/empresas/{id}/logo', 'SuperAdmin\EmpresaController@saveLogo');

Route::resource('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController');


Route::resource('/api/empresas/{empresa_id}/rutas', 'Empresa\RutasController');


//pasajeros//
Route::get('/api/empresa/obtener/pasajeros', 'Empresa\ServiciosController@getPasajeros');
Route::post('/api/empresa/pasajeros', 'Empresa\ServiciosController@postPasajero');
Route::put('/api/empresa/pasajeros{id}', 'Empresa\ServiciosController@putPasajero');
Route::delete('/api/empresa/pasajeros/{id}', 'Empresa\ServiciosController@deletePasajero');
///


//giros//
Route::get('/api/empresa/obtener/giros', 'Empresa\ServiciosController@getGiros');
Route::post('/api/empresa/giros', 'Empresa\ServiciosController@postGiro');
Route::put('/api/empresa/giros/{id}', 'Empresa\ServiciosController@putGiro');
Route::delete('/api/empresa/giros/{id}', 'Empresa\ServiciosController@deleteGiro');
//

//paquetes//
Route::get('/api/empresa/obtener/paquetes', 'Empresa\ServiciosController@getPaquetes');
Route::post('/api/empresa/paquetes', 'Empresa\ServiciosController@postPaquete');
Route::put('/api/empresa/paquetes/{id}', 'Empresa\ServiciosController@putPaquete');
Route::delete('/api/empresa/paquetes/{id}', 'Empresa\ServiciosController@deletePaquete');
//