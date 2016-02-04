<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $table = 'ubicacion_conductor';

    protected $fillable = ['conductor_id', 'ruta_id', 'latitud', 'longitud'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function vehiculo_conductor()
    {
        return $this->belongsTo(Vehiculo::class, 'conductor_id', 'conductor_id', '');
    }
}
