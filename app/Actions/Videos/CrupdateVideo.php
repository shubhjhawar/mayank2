<?php

namespace App\Actions\Videos;

use App\Episode;
use App\Season;
use App\Video;
use Auth;
use Illuminate\Support\Arr;

class CrupdateVideo
{
    public function execute(array $params, int $videoId = null): Video
    {
        if (Arr::get($params, 'episode_num')) {
            $episode = $this->getOrCreateEpisode($params);
            $params['episode_id'] = $episode->id;
        }

        $params['positive_votes'] = 0;
        $params['negative_votes'] = 0;
        $params['origin'] = 'local';

        $captions = Arr::pull($params, 'captions');

        if ($videoId) {
            $video = Video::findOrFail($videoId);
            $video->fill($params)->save();
        } else {
            $params['approved'] = $this->shouldAutoApprove() ? true : false;
            $params['user_id'] = Auth::id();
            $video = Video::create($params);
        }

        if (isset($captions)) {
            $this->syncCaptions($video, $captions);
        }

        return $video;
    }

    private function shouldAutoApprove(): bool
    {
        return settings('streaming.auto_approve') ||
            Auth::user()->hasPermission('admin');
    }

    private function getOrCreateEpisode($params)
    {
        $seasonNumber = Arr::get($params, 'season_num');
        $titleId = Arr::get($params, 'title_id');
        $episodeNumber = Arr::get($params, 'episode_num');

        $episode = Episode::where('title_id', $titleId)
            ->where('episode_number', $episodeNumber)
            ->where('season_number', $seasonNumber)
            ->first();

        if (!$episode) {
            $season = Season::where('number', $seasonNumber)
                ->where('title_id', $titleId)
                ->first();

            $episode = $season->episodes()->create([
                'title_id' => $titleId,
                'episode_number' => $episodeNumber,
                'season_number' => $seasonNumber,
            ]);
        }

        return $episode;
    }

    protected function syncCaptions(Video $video, array $captions): void
    {
        $captions = collect($captions);

        // delete captions that were removed
        $captionIds = $captions->pluck('id')->filter();
        $video
            ->captions()
            ->whereNotIn('id', $captionIds)
            ->delete();

        $captions->each(function ($caption, $index) use ($video) {
            if (isset($caption['id'])) {
                $video
                    ->captions()
                    ->where('id', $caption['id'])
                    ->update([
                        'name' => $caption['name'],
                        'language' => $caption['language'],
                        'url' => $caption['url'],
                        'order' => $index,
                    ]);
            } else {
                $caption['user_id'] = Auth::id();
                $caption['order'] = $index;
                $video->captions()->create($caption);
            }
        });
    }
}
