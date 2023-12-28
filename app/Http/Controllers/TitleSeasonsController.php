<?php

namespace App\Http\Controllers;

use App\Actions\Titles\Retrieve\PaginateTitleSeasons;
use App\Title;
use Common\Core\BaseController;

class TitleSeasonsController extends BaseController
{
    public function __invoke(Title $title)
    {
        $this->authorize('show', $title);

        $pagination = app(PaginateTitleSeasons::class)->execute(
            $title,
            request()->all(),
        );

        return $this->success(['pagination' => $pagination]);
    }
}
