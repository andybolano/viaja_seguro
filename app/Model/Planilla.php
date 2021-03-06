<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Planilla extends Model
{
    protected $table = 'planilla';

    protected $fillable = ['id', 'numero_planilla', 'viaje_id', 'central_id'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function viaje()
    {
        return $this->belongsTo(Viaje::class)->with('ruta.origen.ciudad', 'ruta.destino.ciudad', 'pasajeros', 'giros', 'paquetes', 'deducciones');
    }

    public function central()
    {
        return $this->belongsTo(Central::class)->with('empresa');
    }
}