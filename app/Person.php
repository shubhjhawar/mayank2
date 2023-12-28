<?php

namespace App;

use App\Actions\People\StorePersonData;
use App\Actions\Titles\HandlesEncodedTmdbId;
use App\Actions\Titles\InsertsTmdbTitleOrPerson;
use App\Services\Data\Tmdb\TmdbApi;
use Carbon\Carbon;
use Common\Search\Searchable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Arr;

class Person extends Model
{
    use Searchable, HandlesEncodedTmdbId, InsertsTmdbTitleOrPerson;

    public const MODEL_TYPE = 'person';

    protected $guarded = ['id', 'relation_data', 'model_type'];
    protected $appends = ['model_type'];

    protected $casts = [
        'id' => 'integer',
        'tmdb_id' => 'integer',
        'allow_update' => 'boolean',
        'fully_synced' => 'boolean',
        'adult' => 'boolean',
        'birth_date' => 'date',
        'death_date' => 'date',
    ];

    protected static function booted()
    {
        static::addGlobalScope('adult', function (Builder $builder) {
            if (!config('tmdb.includeAdult')) {
                $builder->where('adult', false);
            }
        });
    }

    public static function firstOrCreateFromEncodedTmdbId(
        string $encodedId,
    ): static {
        [$tmdbId] = static::decodeTmdbIdOrFail($encodedId);
        return static::firstOrCreate([
            'tmdb_id' => $tmdbId,
        ]);
    }

    public function maybeUpdateFromExternal(array $options = []): static|null
    {
        $tmdbImportingIsEnabled =
            settings('content.title_provider') === 'tmdb' ||
            Arr::get($options, 'forceAutomation');

        if ($tmdbImportingIsEnabled && $this->needsUpdating()) {
            $data = app(TmdbApi::class)->getPerson($this);
            if (!$data) {
                return null;
            }
            app(StorePersonData::class)->execute($this, $data);
        }

        return $this;
    }

    public function needsUpdating(array $options = []): bool
    {
        // auto update disabled in settings
        if (
            !Arr::get($options, 'forceAutomation') &&
            settings('content.people_provider') !== 'tmdb'
        ) {
            return false;
        }

        // person was never synced from external site
        if (!$this->exists || ($this->allow_update && !$this->fully_synced)) {
            return true;
        }

        // sync every week
        return $this->allow_update &&
            $this->updated_at->lessThan(Carbon::now()->subWeek());
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function scopeCompact(Builder $query): Builder
    {
        return $query->select(['titles.id', 'titles.name', 'titles.poster']);
    }

    public function credits(): BelongsToMany
    {
        return $this->morphedByMany(Title::class, 'creditable')
            ->select(
                'titles.id',
                'is_series',
                'poster',
                'backdrop',
                'popularity',
                'name',
                'release_date',
                'tmdb_vote_average',
                'local_vote_average',
            )
            ->withPivot(['id', 'job', 'department', 'order', 'character'])
            ->orderBy('titles.release_date', 'desc');
    }

    public function episodeCredits(int $tileId = null): BelongsToMany
    {
        $query = $this->morphedByMany(Episode::class, 'creditable');
        if ($tileId) {
            $query->where('episodes.title_id', $tileId);
        }
        $query
            ->select(
                'episodes.id',
                'episodes.title_id',
                'name',
                'release_date',
                'season_number',
                'episode_number',
            )
            ->withPivot(['job', 'department', 'order', 'character'])
            ->orderBy('episodes.season_number', 'desc')
            ->orderBy('episodes.episode_number', 'desc');
        return $query;
    }

    /**
     * @param int|null $tileId
     * @return BelongsToMany
     */
    public function seasonCredits($tileId = null)
    {
        $query = $this->morphedByMany(Season::class, 'creditable');
        if ($tileId) {
            $query->where('seasons.title_id', $tileId);
        }
        $query
            ->select('seasons.id', 'seasons.title_id')
            ->withPivot(['job', 'department', 'order', 'character'])
            ->orderBy('seasons.number', 'desc');
        return $query;
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public static function filterableFields(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->poster,
            'model_type' => self::MODEL_TYPE,
        ];
    }
}
