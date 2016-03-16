<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Incidencia extends Model
{
    protected $table = 'incidencias_conductor';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }
}
