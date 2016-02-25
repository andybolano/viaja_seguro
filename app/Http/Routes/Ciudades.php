<?php
/**
 * Created by tav0
 * Date: 15/01/16
 * Time: 07:16 PM
 */

Route::get('/api/ciudades', 'SuperAdmin\CiudadesController@index');
Route::get('/api/departamentos', 'SuperAdmin\CiudadesController@getDepartamentos');
Route::get('/api/departamentos/{dpto_id}/municipios', 'SuperAdmin\CiudadesController@getMunicipios');
