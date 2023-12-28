<?php

namespace App\Actions\Demo;

use App\Video;
use Illuminate\Support\Facades\DB;

class GenerateDemoVideoVotes
{
    public function execute(): void
    {
        // delete old votes
        DB::table('video_votes')->truncate();

        foreach (Video::where('upvotes', '<', 60)->cursor() as $video) {
            $video->update([
                'upvotes' => rand(60, 2100),
                'downvotes' => rand(50, 150),
            ]);
        }
    }
}
