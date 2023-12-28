<?php

namespace App\Http\Controllers;

use App\Actions\LocalSearch;
use App\Services\Data\Tmdb\TmdbApi;
use Common\Core\BaseController;
use Illuminate\Support\Collection;
use Str;

class SearchController extends BaseController
{
    public function index($query)
    {
        $dataProvider =
            request('provider') ?: settings('content.search_provider');
        $results = $this->searchUsing($dataProvider, $query);

        $results = $results
            ->map(function ($result) {
                if (isset($result['description'])) {
                    $result['description'] = Str::limit(
                        $result['description'],
                        140,
                    );
                }
                return $result;
            })
            ->values();

        return $this->success([
            'results' => $results,
            'query' => trim(strip_tags($query), '"\''),
        ]);
    }

    private function searchUsing($provider, $query)
    {
        if ($provider === 'tmdb') {
            return app(TmdbApi::class)->search($query, request()->all());
        }

        $results = app(LocalSearch::class)->execute($query, request()->all());

        if ($provider === 'all') {
            $tmdb = app(TmdbApi::class)->search($query, request()->all());
            $results = $results
                ->concat($tmdb)
                ->unique(
                    fn($item) => ($item['tmdb_id'] ?: $item['name']) .
                        $item['model_type'],
                )
                ->groupBy('model_type')
                // make sure specified limit is enforced per group
                // (title, person) instead of the whole collection
                ->map(
                    fn(Collection $group) => $group->slice(
                        0,
                        request('limit', 8),
                    ),
                )
                ->flatten(1)
                ->sortByDesc('popularity');
        }

        return $results;
    }
}
