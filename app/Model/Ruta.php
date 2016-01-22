<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{

    protected $table = 'rutas_centrales';

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

}