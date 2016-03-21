<?php
/**
 * Created by tav0
 * Date: 15/01/16
 * Time: 07:16 PM
 */

Route::post('/api/usuarios/{id}/change_pass', 'UsuariosController@updatePassword');
Route::post('/api/usuarios', 'UsuariosController@create');

Route::put('/api/usuarios/{usuario_id}/reg_id/{reg_id}', 'UsuariosController@updateRegId');