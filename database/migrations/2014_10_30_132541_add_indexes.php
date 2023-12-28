<?php

use Illuminate\Database\Migrations\Migration;

class AddIndexes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('actors_titles', function ($table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('actors_titles');
            if (!array_key_exists('actors_titles_actor_id_index', $indexesFound)) {
                $table->index('actor_id');
            }
            if (!array_key_exists('actors_titles_title_id_index', $indexesFound)) {
                $table->index('title_id');
            }
        });

        Schema::table('episodes', function ($table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('episodes');
            if (!array_key_exists('episodes_season_id_index', $indexesFound)) {
                $table->index('season_id');
            }
            if (!array_key_exists('episodes_episode_number_index', $indexesFound)) {
                $table->index('episode_number');
            }
            if (!array_key_exists('episodes_season_number_index', $indexesFound)) {
                $table->index('season_number');
            }
        });

        Schema::table('seasons', function ($table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('seasons');
            if (!array_key_exists('seasons_title_id_index', $indexesFound)) {
                $table->index('title_id');
            }
            if (!array_key_exists('seasons_title_tmdb_id_index', $indexesFound)) {
                $table->index('title_tmdb_id');
            }
        });

        Schema::table('reviews', function ($table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('reviews');
            if (!array_key_exists('reviews_title_id_index', $indexesFound)) {
                $table->index('title_id');
            }
        });

        Schema::table('images', function ($table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('images');
            if (!array_key_exists('images_title_id_index', $indexesFound)) {
                $table->index('title_id');
            }
        });
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
}
