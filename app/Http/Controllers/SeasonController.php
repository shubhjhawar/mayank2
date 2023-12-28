<?php

namespace App\Http\Controllers;

use App\Actions\Titles\DeleteSeasons;
use App\Actions\Titles\Retrieve\PaginateSeasonEpisodes;
use App\Title;
use App\Video;
use Common\Core\BaseController;
use Illuminate\Support\Arr;

class SeasonController extends BaseController
{
    public function show()
    {
        // $titleId, $titleName, $seasonNumber OR $titleId, $seasonNumber
        $args = func_get_args();
        $title = Title::findOrFail($args[0]);
        $seasonNumber = $args[2] ?? $args[1];
        $params = request()->all();

        if (defined('SHOULD_PRERENDER')) {
            $params['skipUpdating'] = true;
            $params['load'] = 'episodes';
        }

        $this->authorize('show', $title);

        $title->loadCount('seasons');

        $season = $title->findSeason($seasonNumber)->loadCount('episodes');
        $load = explode(',', Arr::get($params, 'load', ''));

        if (!request(['skipUpdating'])) {
            $season->maybeUpdateFromExternal($title);
        }

        $response = ['season' => $season, 'title' => $title];

        if (in_array('episodes', $load)) {
            $response['episodes'] = app(PaginateSeasonEpisodes::class)->execute(
                $title,
                $seasonNumber,
                request()->all(),
            );
        }

        if (in_array('primaryVideo', $load)) {
            $primaryVideo = Video::where('title_id', $season->title_id)
                ->select([
                    'id',
                    'title_id',
                    'name',
                    'category',
                    'episode_id',
                    'season_num',
                    'episode_num',
                ])
                ->where('season_num', $season->number)
                ->when(settings('streaming.prefer_full'), function ($query) {
                    $query->where('category', 'full');
                })
                ->applySelectedSort()
                ->first();
            $season->primary_video = $primaryVideo;
        }

        return $this->success($response);
    }

    public function store($titleId)
    {
        $this->authorize('update', Title::class);

        $title = Title::withCount('seasons')->findOrFail($titleId);

        $season = $title->seasons()->create([
            'number' => $title->seasons_count + 1,
        ]);

        return $this->success(['season' => $season]);
    }

    public function destroy(int $seasonId)
    {
        $this->authorize('update', Title::class);

        app(DeleteSeasons::class)->execute([$seasonId]);

        return $this->success();
    }
}
