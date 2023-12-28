<?php

namespace Common\Channels;

use App\Channel;
use Illuminate\Console\Command;

class UpdateAllChannelsContent extends Command
{
    protected $signature = 'channels:update';

    public function handle(): void
    {
        $channels = app(Channel::class)
            ->where('type', 'channel')
            ->limit(20)
            ->get();

        $this->withProgressBar($channels, function (Channel $channel) {
            $channel->updateContentFromExternal();
        });
    }
}
