<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Giro extends Model
{
    protected $table = 'giros';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'telefono', 'direccion', 'fechaN'];

    public $timestamps = false;
}