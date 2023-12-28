<?php

namespace App\Http\Controllers;

use App\Actions\Titles\DeleteTitles;
use App\Actions\Titles\Retrieve\PaginateTitles;
use App\Actions\Titles\Retrieve\ShowTitle;
use App\Actions\Titles\Store\StoreTitleData;
use App\Jobs\IncrementModelViews;
use App\Title;
use Common\Core\BaseController;

class TitleController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Title::class);

        $pagination = app(PaginateTitles::class)->execute(request()->all());

        return $this->success(['pagination' => $pagination]);
    }

    public function show(string|int $titleId, string $titleName = null)
    {
        $this->authorize('show', Title::class);

        $response = app(ShowTitle::class)->execute($titleId, request()->all());

        (new IncrementModelViews())->execute($response['title']);

        return $this->success($response);
    }

    public function update(int $id)
    {
        $this->authorize('update', Title::class);

        $data = request()->all();
        $title = Title::findOrFail($id);

        $title = app(StoreTitleData::class)->execute($title, $data, [
            'overrideWithEmptyValues' => true,
        ]);

        return $this->success(['title' => $title]);
    }

    public function store()
    {
        $this->authorize('store', Title::class);

        $title = Title::create(request()->all());

        return $this->success(['title' => $title]);
    }

    public function destroy(string $ids)
    {
        $titleIds = explode(',', $ids);
        $this->authorize('destroy', Title::class);

        app(DeleteTitles::class)->execute($titleIds);

        return $this->success();
    }
}
