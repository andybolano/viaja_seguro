<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = 'conductores';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'imagen', 'telefono', 'direccion', 'correo'];

    public $timestamps = false;
}