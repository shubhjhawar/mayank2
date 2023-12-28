<?php

namespace App\Http\Controllers;

use App\Actions\Titles\TitleCredits;
use App\Episode;
use App\Title;
use Common\Core\BaseController;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class EpisodeController extends BaseController
{
    public function show()
    {
        // $titleId, $titleName, $seasonNumber, $episodeNumber OR $titleId, $seasonNumber, $episodeNumber
        $args = func_get_args();
        $title = Title::with('genres')->findOrFail($args[0]);
        $seasonNumber = count($args) === 4 ? $args[2] : $args[1];
        $episodeNumber = count($args) === 4 ? $args[3] : $args[2];
        $params = request()->all();

        if (defined('SHOULD_PRERENDER')) {
            $params['skipUpdating'] = true;
            $params['load'] = 'videos,compactCredits';
        }

        $this->authorize('show', $title);

        $season = $title->findSeason($seasonNumber);

        if (!request('skipUpdating')) {
            $season->maybeUpdateFromExternal($title);
        }

        $episode = $season->findEpisode($episodeNumber);

        $response = [
            'title' => $title->toArray(),
        ];

        $load = explode(',', Arr::get($params, 'load', ''));
        if (in_array('compactCredits', $load)) {
            $response['credits'] = app(TitleCredits::class)->loadCompact(
                $title,
                $season,
                $episode,
            );
        }
        if (in_array('credits', $load)) {
            $response['credits'] = app(TitleCredits::class)->loadFull(
                $title,
                $season,
                $episode,
            );
        }

        if (in_array('videos', $load)) {
            $episode->load(['videos']);
        }

        if (in_array('primaryVideo', $load)) {
            $episode->load(['primaryVideo']);
        }

        // prevent seo blade view from loading any relations
        $response['episode'] = $episode->toArray();

        return $this->success($response);
    }

    public function update(Title $title, int $seasonNumber, int $episodeNumber)
    {
        $this->authorize('update', $title);

        $episode = $title
            ->episodes()
            ->where('season_number', $seasonNumber)
            ->where('episode_number', $episodeNumber)
            ->firstOrFail();

        $this->validate(request(), [
            'episode_number' => [
                'integer',
                Rule::unique('episodes')
                    ->ignore($episode->episode_number, 'episode_number')
                    ->where(function (Builder $query) use ($episode) {
                        $query
                            ->where('season_number', $episode->season_number)
                            ->where('title_id', $episode->title_id);
                    }),
            ],
        ]);

        $episode->fill(request()->all())->save();

        return $this->success(['episode' => $episode]);
    }

    public function store(Title $title, int $seasonNumber)
    {
        $this->authorize('update', $title);

        $season = $title->findSeason($seasonNumber)->loadCount('episodes');

        $this->validate(request(), [
            'episode_number' => [
                'integer',
                Rule::unique('episodes')->where(function (Builder $query) use (
                    $season,
                ) {
                    $query
                        ->where('season_number', $season->number)
                        ->where('title_id', $season->title_id);
                }),
            ],
        ]);

        $epNum = request('episode_number', $season->episodes_count + 1);

        $episode = Episode::create(
            array_merge(request()->all(), [
                'season_number' => $season->number,
                'episode_number' => $epNum,
                'season_id' => $season->id,
                'title_id' => $season->title_id,
            ]),
        );

        return $this->success(['episode' => $episode]);
    }

    public function destroy(int $id)
    {
        $this->authorize('destroy', Title::class);

        $episode = Episode::findOrFail($id);
        $episode->credits()->detach();
        $episode->delete();

        return $this->success();
    }
}
