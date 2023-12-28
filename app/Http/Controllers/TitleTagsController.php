<?php

namespace App\Http\Controllers;

use App\Title;
use Common\Core\BaseController;
use Illuminate\Support\Str;

class TitleTagsController extends BaseController
{
    public function store(Title $title, string $type)
    {
        $this->authorize('update', $title);

        $data = $this->validate(request(), [
            'tag_name' => 'required|string',
        ]);

        $relation = $this->getRelationName($type);

        $tags = $title
            ->$relation()
            ->getModel()
            ->insertOrRetrieve([$data['tag_name']]);

        $title->$relation()->syncWithoutDetaching($tags->pluck('id'));

        return $this->success();
    }

    public function destroy(Title $title, string $type, int $tagId)
    {
        $this->authorize('update', $title);

        $relation = $this->getRelationName($type);

        $title->$relation()->detach([$tagId]);

        return $this->success();
    }

    private function getRelationName($type)
    {
        if ($type === 'production_country') {
            $type = 'country';
        }
        return Str::plural($type);
    }
}
