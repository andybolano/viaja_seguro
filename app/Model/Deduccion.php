<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Deduccion extends Model
{
    protected $table = 'deducciones';

    protected $fillable = ['nombre', 'descripcion', 'valor', 'estado'];

    public $timestamps = false;
}