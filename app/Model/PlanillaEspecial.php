<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class PlanillaEspecial extends Model
{
    protected $table = 'planilla_especial';

    protected $fillable = ['numero_planilla', 'viaje_id', 'central_id'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function viaje()
    {
        return $this->belongsTo(Viaje::class)->with('ruta.origen.ciudad', 'ruta.destino.ciudad', 'pasajeros');
    }

    public function central()
    {
        return $this->belongsTo(Central::class)->with('empresa');
    }
}
