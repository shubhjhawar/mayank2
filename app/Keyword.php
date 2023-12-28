<?php

namespace App;

use Common\Tags\Tag;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

class Keyword extends Tag
{
    const MODEL_TYPE = 'keyword';

    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(Title::class);
    }

    public function insertOrRetrieve(
        Collection|array $tags,
        ?string $type = 'custom',
        ?int $userId = null,
    ): Collection {
        // keywords table will not have type or user_id columns
        return parent::insertOrRetrieve($tags, null, null);
    }

    public function getByNames(
        Collection $names,
        string $type = null,
        int $userId = null,
    ): Collection {
        return parent::getByNames($names, null, null);
    }
}
