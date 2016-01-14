<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = 'viaja_seguro_conductores';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'imagen', 'telefono', 'direccion', 'correo'];

    public $timestamps = false;
}