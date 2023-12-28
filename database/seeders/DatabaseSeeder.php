<?php

namespace Database\Seeders;

use Common\Channels\GenerateChannelsFromConfig;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(WatchlistSeeder::class);
        $this->call(BillingPlanSeeder::class);

        if ( ! config('common.site.demo')) {
            $homepageChannel = (new GenerateChannelsFromConfig())->execute([
                resource_path('defaults/channels/shared-channels.json'),
                resource_path('defaults/channels/default-channels.json'),
            ]);
            settings()->save([
                'homepage.type' => 'channels',
                'homepage.value' => $homepageChannel->id,
            ]);
        }
    }
}
