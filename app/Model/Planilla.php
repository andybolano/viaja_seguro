<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Planilla extends Model
{
    protected $table = 'planilla';

    protected $fillable = ['id', 'numero_planilla', 'viaje_id'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function viaje()
    {
        return $this->belongsTo(Viaje::class);
    }

    public function central()
    {
        return $this->belongsTo(Central::class);
    }
}