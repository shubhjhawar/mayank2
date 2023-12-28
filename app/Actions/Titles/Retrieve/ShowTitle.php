<?php

namespace App\Actions\Titles\Retrieve;

use App\Actions\Titles\TitleCredits;
use App\Title;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ShowTitle
{
    public function execute(int|string $id, array $params): array
    {
        if (defined('SHOULD_PRERENDER')) {
            $params['skipUpdating'] = true;
            $params['load'] = 'genres,compactCredits,videos,reviews,images';
            $params['loadCount'] = 'seasons';
        }

        if (is_numeric($id) || ctype_digit($id)) {
            $title = Title::findOrFail($id);
        } else {
            $title = Title::firstOrCreateFromEncodedTmdbId($id);
        }

        if (!Arr::get($params, 'skipUpdating')) {
            $title = $title->maybeUpdateFromExternal();
            if (!$title) {
                abort(404);
            }
        }

        $response = ['title' => $title->loadCount('seasons')];

        foreach (explode(',', Arr::get($params, 'load', '')) as $relation) {
            $methodName = sprintf('load%s', Str::camel($relation));
            if (method_exists($this, $methodName)) {
                $response = $this->$methodName($title, $params, $response);
            } elseif (method_exists($title, $relation)) {
                $title->load($relation);
            }
        }

        foreach (
            explode(',', Arr::get($params, 'loadCount', ''))
            as $relation
        ) {
            if (method_exists($title, $relation)) {
                $title->loadCount($relation);
            }
        }

        return $response;
    }

    private function loadSeasons(
        Title $title,
        array $params,
        array $response,
    ): array {
        if ($title->is_series) {
            $response['seasons'] = app(PaginateTitleSeasons::class)->execute(
                $title,
            );
        }
        return $response;
    }

    private function loadVideos(
        Title $title,
        array $params,
        array $response,
    ): array {
        $episode = (int) Arr::get($params, 'episodeNumber');
        $season = (int) Arr::get($params, 'seasonNumber');

        $title->load([
            'videos' => function (HasMany $query) use ($episode, $season) {
                $query->where('approved', true);

                if ($season || $episode) {
                    if ($season) {
                        $query->where('season_num', $season);
                    }
                    if ($episode) {
                        $query->where('episode_num', $episode);
                    }
                } else {
                    $query->whereNull('episode_num');
                }
            },
        ]);

        return $response;
    }

    private function loadCredits(
        Title $title,
        array $params,
        array $response,
    ): array {
        $response['credits'] = app(TitleCredits::class)->loadFull($title);
        return $response;
    }

    private function loadCompactCredits(
        Title $title,
        $params,
        array $response,
    ): array {
        $response['credits'] = app(TitleCredits::class)->loadCompact($title);
        return $response;
    }

    private function loadReviews(Title $title, $params, array $response): array
    {
        $title->load([
            'reviews' => function ($query) {
                $query->with('user')->where('has_text', true);
            },
        ]);
        return $response;
    }
}
