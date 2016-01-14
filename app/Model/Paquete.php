<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Paquete extends Model
{
    protected $table = 'viaja_seguro_paquetes';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'telefono', 'direccion', 'fechaN'];

    public $timestamps = false;
}