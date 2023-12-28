<?php

namespace App\Services;

use App\Episode;
use App\Genre;
use App\NewsArticle;
use App\Person;
use App\Season;
use App\Title;
use App\User;
use App\Video;
use Common\Core\Prerender\BaseUrlGenerator;

class UrlGenerator extends BaseUrlGenerator
{
    public function title(array|Title $title): string
    {
        $slug = slugify($title['name']);
        return url("titles/{$title['id']}/{$slug}");
    }

    public function season(array|Season $season, $dataOrTitle): string
    {
        $title = $dataOrTitle['title'] ?? $dataOrTitle;
        $titleUrl = $this->title($title);
        return "$titleUrl/season/{$season['number']}";
    }

    public function episode(
        array|Episode $episode,
        $dataOrTitle,
    ): string {
        $title = $dataOrTitle['title'] ?? $dataOrTitle;
        $titleUrl = $this->title($title);
        return "$titleUrl/season/{$episode['season_number']}/episode/{$episode['episode_number']}";
    }

    public function watch(array|Video $video): string
    {
        return url("watch/{$video['id']}");
    }

    public function person(array|Person $person): string
    {
        $slug = slugify($person['name']);
        return url("people/{$person['id']}/{$slug}");
    }

    public function article(array|NewsArticle $article): string
    {
        return url("news/{$article['id']}");
    }

    public function genre(array|Genre $genre): string
    {
        return url("genre/{$genre['id']}");
    }

    public function search(array $data): string
    {
        return url('search/' . $data['query']);
    }

    public function user(User|array $model): string
    {
        return url('users/' . $model['id']);
    }

    public function mediaImage(string|array $item): string|null
    {
        if (is_string($item)) {
            return $item;
        } else {
            return $item['poster'] ?: $item['url'];
        }
    }
}
