<?php namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class Prestacion extends Model
{
    protected $table = 'prestaciones';

    protected $guarded = ['id'];

    public $timestamps = false;

}