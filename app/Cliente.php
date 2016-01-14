<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'viaja_seguro_clientes';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'telefono', 'direccion', 'fechaN'];

    public $timestamps = false;
}