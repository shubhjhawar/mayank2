<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('titles', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('titles');

            if (!array_key_exists('titles_budget_index', $indexesFound)) {
                $table->index('budget');
            }

            if (!array_key_exists('titles_revenue_index', $indexesFound)) {
                $table->index('revenue');
            }

            if (!array_key_exists('titles_language_index', $indexesFound)) {
                $table->index('language');
            }

            if (!array_key_exists('titles_adult_index', $indexesFound)) {
                $table->index('adult');
            }

            if (!array_key_exists('titles_year_index', $indexesFound)) {
                $table->index('year');
            }
        });
    }

    public function down()
    {
        //
    }
};
