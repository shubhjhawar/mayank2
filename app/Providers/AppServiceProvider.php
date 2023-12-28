<?php

namespace App\Providers;

use App\Actions\AppValueLists;
use App\Channel;
use App\Episode;
use App\Person;
use App\Services\Admin\GetAnalyticsHeaderData;
use App\Services\AppBootstrapData;
use App\Services\UrlGenerator;
use App\Title;
use Common\Admin\Analytics\Actions\GetAnalyticsHeaderDataAction;
use Common\Core\Bootstrap\BootstrapData;
use Common\Core\Contracts\AppUrlGenerator;
use Common\Core\Values\ValueLists;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(BootstrapData::class, AppBootstrapData::class);

        Model::preventLazyLoading(!$this->app->isProduction());

        // This will only work when loading from collection, because we need access to channel config
        Channel::resolveRelationUsing(
            'items',
            fn(Channel $channel) => $channel->morphedByMany(
                modelTypeToNamespace(
                    $channel->config['contentModel'] ?? Title::class,
                ),
                'channelable',
            ),
        );

        Title::disableSearchSyncing();
        Person::disableSearchSyncing();
        Episode::disableSearchSyncing();
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // bind analytics
        $this->app->bind(
            GetAnalyticsHeaderDataAction::class,
            GetAnalyticsHeaderData::class,
        );

        $this->app->bind(AppUrlGenerator::class, UrlGenerator::class);

        $this->app->bind(ValueLists::class, AppValueLists::class);
    }
}
