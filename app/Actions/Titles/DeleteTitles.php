<?php

namespace App\Actions\Titles;

use App\Image;
use App\Listable;
use App\Review;
use App\Season;
use App\Title;
use App\Video;
use Common\Comments\Comment;
use Illuminate\Support\Facades\DB;

class DeleteTitles
{
    public function execute(array $titleIds): void
    {
        $seasonIds = app(Season::class)
            ->whereIn('title_id', $titleIds)
            ->pluck('id');
        app(DeleteSeasons::class)->execute($seasonIds);

        // images
        app(Image::class)
            ->whereIn('model_id', $titleIds)
            ->where('model_type', Title::class)
            ->delete();

        // list items
        app(Listable::class)
            ->whereIn('listable_id', $titleIds)
            ->where('listable_type', Title::class)
            ->delete();

        // channel items
        DB::table('channelables')
            ->whereIn('channelable_id', $titleIds)
            ->where('channelable_type', Title::class)
            ->delete();

        // reviews
        Review::whereIn('reviewable_id', $titleIds)
            ->where('reviewable_id', Title::class)
            ->delete();

        // comments
        Comment::whereIn('commentable_id', $titleIds)
            ->where('commentable_id', Title::class)
            ->delete();

        app(Review::class)
            ->whereIn('reviewable_id', $titleIds)
            ->where('reviewable_id', Title::class)
            ->delete();

        // tags
        DB::table('taggables')
            ->whereIn('taggable_id', $titleIds)
            ->where('taggable_type', Title::class)
            ->delete();

        // keywords
        DB::table('keyword_title')
            ->whereIn('title_id', $titleIds)
            ->delete();

        // countries
        DB::table('country_title')
            ->whereIn('title_id', $titleIds)
            ->delete();

        // genres
        DB::table('genre_title')
            ->whereIn('title_id', $titleIds)
            ->delete();

        // videos
        $videoIds = app(Video::class)
            ->whereIn('title_id', $titleIds)
            ->pluck('id');
        app(Video::class)
            ->whereIn('id', $videoIds)
            ->delete();

        DB::table('video_votes')
            ->whereIn('video_id', $videoIds)
            ->delete();
        DB::table('video_captions')
            ->whereIn('video_id', $videoIds)
            ->delete();
        DB::table('video_reports')
            ->whereIn('video_id', $videoIds)
            ->delete();
        DB::table('video_plays')
            ->whereIn('video_id', $videoIds)
            ->delete();

        // titles
        Title::withoutGlobalScope('adult')
            ->whereIn('id', $titleIds)
            ->delete();
    }
}
