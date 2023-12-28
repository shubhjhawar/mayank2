<?php

namespace App\Http\Controllers;

use Common\Core\BaseController;

class ReviewableController extends BaseController
{
    public function index()
    {
        $modelType = request('reviewable_type');
        $modelId = request('reviewable_id');

        if (!$modelType || !$modelId) {
            abort(404);
        }

        $reviewable = app(modelTypeToNamespace($modelType))->findOrFail(
            $modelId,
        );

        $this->authorize('show', $reviewable);

        $sharedReviewId = request('sharedReviewId');
        $page = (int) request('page') ?? 1;
        $orderBy = request('orderBy') ?? 'created_at';
        $orderDir = request('orderDir') ?? 'desc';

        $pagination = $reviewable
            ->reviews()
            ->with([
                'user',
                'feedback' => fn($q) => $q->where('user_id', auth()->id()),
                'reports' => fn($q) => $q
                    ->where('user_id', auth()->id())
                    ->orWhere('user_ip', getIp()),
            ])
            ->withTextOnly()
            ->when(
                $orderBy === 'mostHelpful',
                fn($q) => $q->orderByMostHelpful(),
                fn($q) => $q->orderBy($orderBy, $orderDir),
            )
            ->paginate(request('perPage') ?? 10)
            ->through(function ($review) {
                if ($feedback = $review->feedback->first()) {
                    $review->current_user_feedback = $feedback->is_helpful;
                }
                if ($review->reports->first()) {
                    $review->current_user_reported = true;
                }
                $review->unsetRelation('feedback');
                $review->unsetRelation('reports');
                return $review;
            });

        return $this->success([
            'pagination' => $pagination,
            // only load shared review and current user review for initial load and not subsequent pagination
            'current_user_review' =>
                $page === 1
                    ? $reviewable
                        ->reviews()
                        ->where('user_id', auth()->id())
                        ->first()
                    : null,
            'shared_review' =>
                $sharedReviewId && $page === 1
                    ? $reviewable->reviews()->find(request('sharedReviewId'))
                    : null,
        ]);
    }
}
