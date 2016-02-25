<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{

    protected $table = 'municipios';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

}
