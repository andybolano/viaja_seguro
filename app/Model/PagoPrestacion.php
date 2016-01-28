<?php namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class PagoPrestacion extends Model
{
    protected $table = 'pagos_prestaciones';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function prestacion(){
        return $this->belongsTo(Prestacion::class);
    }

}