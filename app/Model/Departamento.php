<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{

    protected $table = 'departamentos';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function municipios()
    {
        return $this->hasMany(Municipio::class);
    }

}
