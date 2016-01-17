<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{

    protected $table = 'ciudades';

    protected $guarded = ['id'];

    public $timestamps = false;

}