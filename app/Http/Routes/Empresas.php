<?php
Route::get('/api/empresas', 'SuperAdmin\EmpresaController@index');
Route::get('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@show');
Route::post('/api/empresas', 'SuperAdmin\EmpresaController@store');
Route::post('/api/empresas/{empresa_id}/logo', 'SuperAdmin\EmpresaController@saveLogo');
Route::put('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@update');
Route::delete('/api/empresas/{empresa_id}', 'SuperAdmin\EmpresaController@destroy');

Route::get('/api/empresas/{empresa_id}/vehiculos', 'SuperAdmin\EmpresaController@getVehiculos');
Route::get('/api/empresas/{empresa_id}/conductores', 'SuperAdmin\EmpresaController@getConductores');

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