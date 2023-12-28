<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('people', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('people');

            if (!array_key_exists('people_birth_date_index', $indexesFound)) {
                $table->index('birth_date');
            }

            if (!array_key_exists('people_death_date_index', $indexesFound)) {
                $table->index('death_date');
            }

            if (!array_key_exists('people_views_index', $indexesFound)) {
                $table->index('views');
            }

            if (!array_key_exists('people_known_for_index', $indexesFound)) {
                $table->index('known_for');
            }

            if (!array_key_exists('people_gender_index', $indexesFound)) {
                $table->index('gender');
            }

            if (!array_key_exists('people_adult_index', $indexesFound)) {
                $table->index('adult');
            }

            if (!array_key_exists('people_popularity_index', $indexesFound)) {
                $table->index('popularity');
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
};
