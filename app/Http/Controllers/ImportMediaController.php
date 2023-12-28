<?php

namespace App\Http\Controllers;

use App\Person;
use App\Services\Data\Tmdb\TmdbApi;
use App\Title;
use Carbon\Carbon;
use Common\Core\BaseController;

class ImportMediaController extends BaseController
{
    public function importMediaItem()
    {
        $this->authorize('store', Title::class);

        $data = $this->validate(request(), [
            'media_type' => 'required|string',
            'tmdb_id' => 'required|integer',
        ]);

        if ($data['media_type'] === Person::MODEL_TYPE) {
            $mediaItem = Person::firstOrCreate([
                'tmdb_id' => $data['tmdb_id'],
            ])->maybeUpdateFromExternal([
                'forceAutomation' => true,
            ]);
        } else {
            $mediaItem = Title::firstOrCreate([
                'tmdb_id' => $data['tmdb_id'],
                'is_Series' => $data['media_type'] === Title::SERIES_TYPE,
            ])->maybeUpdateFromExternal([
                'forceAutomation' => true,
                'updateLast3Seasons' => true,
            ]);
        }

        if (!$mediaItem) {
            abort(404);
        }

        return ['mediaItem' => $mediaItem];
    }

    public function importViaBrowse()
    {
        $this->authorize('store', Title::class);

        if (!config('services.tmdb.key')) {
            abort(
                403,
                'Enter your Themoviedb API key in settings page before importing titles.',
            );
        }

        @set_time_limit(0);
        @ini_set('memory_limit', '200M');

        return response()->stream(
            function () {
                $type = request('type', 'movie');
                $pagesToImport = request('pages_to_import', 10);
                $startFromPage = request('start_from_page', 1);

                $tmdbParams = [
                    'with_release_type' => '2|3',
                ];

                if (request('country')) {
                    $tmdbParams['with_origin_country'] = strtolower(
                        request('country'),
                    );
                }
                if (request('language')) {
                    $tmdbParams['with_original_language'] = request('language');
                }
                if (request('min_rating')) {
                    $tmdbParams['vote_average.gte'] = request('min_rating');
                }
                if (request('max_rating')) {
                    $tmdbParams['vote_average.lte'] = request('max_rating');
                }
                if (request('genres')) {
                    $tmdbParams['with_genres'] = request('genres');
                }
                if (request('keywords')) {
                    $tmdbParams['keywords'] = request('keywords');
                }
                if (request('start_date') && request('end_date')) {
                    $tmdbParams['release_date.gte'] = Carbon::parse(
                        request('start_date'),
                    )->format('Y-m-d');
                    $tmdbParams['release_date.lte'] = Carbon::parse(
                        request('end_date'),
                    )->format('Y-m-d');
                }

                if ($pagesToImport + $startFromPage > 500) {
                    $pagesToImport = 500 - $startFromPage;
                }

                $currentPage = $startFromPage;
                while ($currentPage <= $pagesToImport) {
                    $response = app(TmdbApi::class)->browse(
                        $currentPage,
                        $type,
                        $tmdbParams,
                    );

                    if ($response['total_pages'] < $pagesToImport) {
                        $pagesToImport = $response['total_pages'];
                    }

                    foreach ($response['results'] as $index => $result) {
                        Title::firstOrCreate([
                            'tmdb_id' => $result['id'],
                            'is_series' => $result['is_series'],
                        ])->maybeUpdateFromExternal([
                            'forceAutomation' => true,
                        ]);

                        $totalItems = $pagesToImport * 20;
                        $currentItem = ($currentPage - 1) * 20 + ($index + 1);
                        $progress = round(($currentItem / $totalItems) * 100);

                        echo "event: ping\n\n";
                        $data = json_encode([
                            'currentPage' => $currentPage,
                            'totalItems' => $totalItems,
                            'currentItem' => $currentItem,
                            'currentIndex' => $index,
                            'totalPages' => $pagesToImport,
                            'title' => $result['name'],
                            'progress' => $progress,
                        ]);
                        echo "data: $data\n\n";

                        //echo "Imported page: $i | title: $index <br>";
                        ob_flush();
                        flush();
                    }

                    $currentPage++;

                    if (connection_aborted()) {
                        break;
                    }
                }
            },
            200,
            [
                'Cache-Control' => 'no-cache',
                'Content-Type' => 'text/event-stream',
            ],
        );
    }
}
