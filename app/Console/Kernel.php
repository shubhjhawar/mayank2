<?php

namespace App\Console;

use Common\Channels\UpdateAllChannelsContent;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [UpdateAllChannelsContent::class];

    protected function schedule(Schedule $schedule): void
    {
        if (settings('news.auto_update')) {
            $schedule->command('news:update')->daily();
        }

        if (
            config('services.tmdb.key') &&
            (settings('content.force_season_update') ||
                settings('content.title_provider') === 'tmdb')
        ) {
            $schedule->command('seasons:update')->everyFourHours();
        }

        if (config('common.site.demo')) {
            $schedule->command('demo:clean')->daily();
        }

        $schedule->command('channels:update')->daily();
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
