<?php

use App\NewsArticle;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach (
            DB::table('custom_pages')
                ->where('type', 'news_article')
                ->cursor()
            as $article
        ) {
            $meta = json_decode($article->meta, true);
            NewsArticle::create([
                'title' => $article->title,
                'body' => $article->body,
                'slug' => $article->slug,
                'image' => $meta['image'] ?? null,
                'source' => $meta['source'] ?? null,
                'source_url' => $meta['source_url'] ?? null,
                'byline' => $meta['byline'] ?? null,
            ]);
            DB::table('custom_pages')->delete($article->id);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
