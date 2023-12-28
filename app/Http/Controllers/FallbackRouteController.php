<?php

namespace App\Http\Controllers;

use App\Channel;
use Common\Channels\ChannelController;
use Common\Core\Controllers\HomeController;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FallbackRouteController
{
    public function __invoke(string $path)
    {
        $parts = explode('/', $path);
        if (count($parts) > 2 || count($parts) < 1) {
            return $this->renderClient();
        }

        // first try to match a channel, if none is found, fallback to rendering client side app
        try {
            if ($parts[0] === 'lists') {
                request()->merge(['channelType' => 'list']);
                $parts[0] = $parts[1];
                $parts[1] = null;
            }

            $slugOrId = $parts[0];
            $restriction = $parts[1] ?? null;
            return $this->renderChannel($slugOrId, $restriction);
        } catch (ModelNotFoundException) {
            return $this->renderClient();
        }
    }

    public function renderChannel(string $slugOrId, ?string $restriction = null)
    {
        $channel = app(Channel::class)->resolveRouteBinding($slugOrId);
        // need to override this, otherwise "uses" will be this closure and "handleSeo" will not work
        request()->route()->action['uses'] = ChannelController::class . '@show';
        if ($restriction) {
            request()->merge(['restriction' => $restriction]);
        }
        return app(ChannelController::class)->show($channel);
    }

    public function renderClient()
    {
        // no need to prerender channels here, use base HomeController
        request()->route()->action['uses'] = HomeController::class . '@show';
        return app(HomeController::class)->show();
    }
}
