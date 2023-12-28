<?php namespace App\Services;

use App\Title;
use Common\Core\Bootstrap\BaseBootstrapData;

class AppBootstrapData extends BaseBootstrapData
{
    public function init(): self
    {
        parent::init();

        $this->data['settings']['tmdb_is_setup'] = !is_null(
            config('services.tmdb.key'),
        );

        if (
            settings('homepage.type') === 'landingPage' &&
            request()->route()->uri === '/'
        ) {
            $this->data['trendingTitles'] = Title::orderBy('popularity', 'desc')
                ->compact()
                ->limit(6)
                ->get();
        }

        return $this;
    }
}
