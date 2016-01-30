<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{

    protected $table = 'turnos';

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

}