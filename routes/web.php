<?php

use App\Http\Controllers\AppHomeController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\FallbackRouteController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\TitleController;

// FRONT-END ROUTES THAT NEED TO BE PRE-RENDERED
Route::get('/', [AppHomeController::class, 'show'])->middleware('prerenderIfCrawler');

// TITLE/SEASON/EPISODE
Route::get('titles/{id}/{name}', [TitleController::class, 'show'])->middleware('prerenderIfCrawler');
Route::get('titles/{titleId}/{titleName}/season/{seasonNumber}', [SeasonController::class, 'show'])->middleware('prerenderIfCrawler');
Route::get('titles/{titleId}/{titleName}/season/{seasonNumber}/episode/{episodeNumber}', [EpisodeController::class, 'show'])->middleware('prerenderIfCrawler');

Route::get('people/{id}/{name}', 'PersonController@show')->middleware('prerenderIfCrawler');
Route::get('search/{query}', [SearchController::class, 'index'])->middleware('prerenderIfCrawler');
Route::get('news/{id}', 'NewsController@show')->middleware('prerenderIfCrawler');

// CHANNELS and fallback to client rendering if no channel matches
Route::fallback(FallbackRouteController::class)->middleware('prerenderIfCrawler');
