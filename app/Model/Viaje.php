<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Viaje extends Model
{
    protected $table = 'viajes';

    public $fillable = ['id', 'conductor_id', 'ruta_id', 'fecha', 'estado'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function pasajeros()
    {
        return $this->belongsToMany(Pasajero::class, 'viaje_pasajeros', 'viaje_id', 'pasajero_id');
    }

    public function giros()
    {
        return $this->belongsToMany(Pasajero::class, 'viaje_giros', 'viaje_id', 'giro_id');
    }

    public function paquetes()
    {
        return $this->belongsToMany(Pasajero::class, 'viaje_paquetes', 'viaje_id', 'paquete_id');
    }

    public function deducciones()
    {
        return $this->belongsToMany(Deduccion::class, 'viaje_deducciones', 'viaje_id', 'deduccion_id');
    }
}