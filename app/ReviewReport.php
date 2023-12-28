<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReviewReport extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'review_id' => 'integer',
    ];
}
