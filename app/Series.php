<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;

class Series extends Title
{
    protected $table = 'titles';

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('titleType', function (Builder $builder) {
            $builder->where('is_series', true);
        });
    }
}
