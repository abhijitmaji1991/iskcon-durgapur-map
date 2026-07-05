<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'category',
        'lat',
        'lng',
        'address',
        'description',
        'phone',
        'timings',
        'president',
        'leader',
        'active_members',
        'occupation',
        'image',
    ];
}
