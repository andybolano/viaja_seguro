<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{

    protected $table = 'rutas_centrales';

    public $fillable = ['id_central_origen', 'id_central_destino', 'trayectoria'];

    protected $guarded = ['id'];

    public $timestamps = false;

    public function origen()
    {
        return $this->belongsTo(Central::class, 'id_central_origen', 'id');
    }

    public function destino()
    {
        return $this->belongsTo(Central::class, 'id_central_destino', 'id');
    }

    public function turnos()
    {
        return $this->hasMany(Turno::class, 'ruta_id')->select('conductor_id', 'turno')->orderBy('turno');
    }

    public function toUpdateTurnos()
    {
        return $this->belongsToMany(Conductor::class, 'turnos')->withPivot('turno');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }
}