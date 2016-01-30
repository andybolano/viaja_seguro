<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Deduccion extends Model
{
    protected $table = 'deducciones';

    protected $casts = ['estado' => 'boolean'];

    protected $fillable = ['id','nombre', 'descripcion', 'valor', 'estado'];

    public $timestamps = false;
}