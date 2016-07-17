<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{

    protected $table = 'turnos';

    public $fillable = ['ruta_id', 'conductor_id', 'turno'];

    public $timestamps = false;

    public function conductor()
    {
        return $this->belongsTo(Conductor::class)->with('vehiculo');
    }

}