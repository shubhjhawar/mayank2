<?php

namespace App\Actions\Demo;

use App\Title;
use App\User;
use Common\Files\Traits\HandlesEntryPaths;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GenerateDemoReviews
{
    use HandlesEntryPaths;

    private Collection $users;

    public function execute(): void
    {
        DB::table('review_reports')->truncate();
        DB::table('review_feedback')->truncate();

        $demoEmails = collect(
            json_decode(
                file_get_contents(app_path('Actions/Demo/demo-users.json')),
                true,
            ),
        )->pluck('email');
        $this->users = User::whereIn('email', $demoEmails)->get();

        $this->generateFor('movie');
        $this->generateFor('series');
    }

    protected function generateFor(string $type): void
    {
        $movies = Title::where('is_series', $type == 'series')
            ->where('release_date', '<', now()->subDays(6))
            ->has('reviews', '<', 40)
            ->cursor();

        $userSequence = new Sequence(...$this->users->pluck('id')->toArray());

        $data = json_decode(
            file_get_contents(app_path("Actions/Demo/demo-$type-reviews.json")),
            true,
        );

        $movieReviews = collect($data)
            ->slice(0, rand(40, $this->users->count()))
            ->map(function ($review) use ($userSequence) {
                $date = now()
                    ->subMonth(rand(0, 2))
                    ->subDays(rand(1, 12));
                return [
                    'user_id' => $userSequence(),
                    'title' => $review['title'],
                    'body' => $review['body'],
                    'score' => $review['score'],
                    'has_text' => true,
                    'helpful_count' => rand(10, 200),
                    'not_helpful_count' => rand(0, 20),
                    'created_at' => $date,
                    'updated_at' => $date,
                ];
            });

        foreach ($movies as $movie) {
            $payload = $movieReviews->map(
                fn($review) => array_merge($review, [
                    'reviewable_id' => $movie->id,
                    'reviewable_type' => Title::class,
                ]),
            );
            DB::table('reviews')->insert($payload->toArray());
        }
    }
}
