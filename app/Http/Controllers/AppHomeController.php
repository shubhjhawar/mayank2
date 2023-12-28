<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FallbackRouteController;
use Auth;
use Common\Core\Controllers\HomeController;

class AppHomeController extends HomeController
{
    protected function handleSeo(&$data = [], $options = [])
    {
        if (
            request()->method() === 'GET' &&
            request()->path() === '/' &&
            defined('SHOULD_PRERENDER')
        ) {
            if (
                settings('homepage.type') === 'channels' ||
                (Auth::check() && settings('homepage.type') === 'landingPage')
            ) {
                return app(FallbackRouteController::class)->renderChannel(
                    settings('homepage.value')
                );
            } else {
                $options['prerender.view'] = 'home.show';
                $options['prerender.config'] = 'home.show';
            }
        }

        return parent::handleSeo($data, $options);
    }
}
