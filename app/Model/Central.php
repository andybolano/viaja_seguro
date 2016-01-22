<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Central extends Model
{

    protected $table = 'centrales';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    public function rutas()
    {
        return $this->hasMany(Ruta::class, 'id_central_origen', 'id');
    }

}