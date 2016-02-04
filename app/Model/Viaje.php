<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Viaje extends Model
{
    protected $table = 'viajes';

    public $fillable = ['id', 'conductor_id', 'ruta_id', 'latitud', 'longitud', 'fecha', 'estado'];

    public $timestamps = false;

    public function conductor(){
        return $this->belongsTo(Conductor::class);
    }

    public function ruta(){
        return $this->belongsTo(Ruta::class);
    }
}