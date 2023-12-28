<?php

namespace App\Actions\Demo;

use App\Episode;
use App\Title;
use App\User;
use Common\Files\Traits\HandlesEntryPaths;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\ConsoleOutput;

class GenerateDemoComments
{
    use HandlesEntryPaths;

    private Collection $users;

    private int $currentId = 1;

    public function execute(string $variant = null): void
    {
        DB::table('comment_reports')->truncate();
        DB::table('comment_votes')->truncate();
        $this->currentId = DB::table('comments')->max('id') + 1;

        $demoEmails = collect(
            json_decode(
                file_get_contents(app_path('Actions/Demo/demo-users.json')),
                true,
            ),
        )->pluck('email');
        $this->users = User::whereIn('email', $demoEmails)->get();

        // movies
        $this->generateFor(
            Title::where('release_date', '<', now()->subDays(6))->where(
                'is_series',
                false,
            ),
            $variant === 'anime'
                ? app_path('Actions/Demo/demo-anime-comments.json')
                : app_path('Actions/Demo/demo-movie-comments.json'),
        );

        // series
        $this->generateFor(
            Title::where('release_date', '<', now()->subDays(6))->where(
                'is_series',
                true,
            ),
            $variant === 'anime'
                ? app_path('Actions/Demo/demo-anime-comments.json')
                : app_path('Actions/Demo/demo-series-comments.json'),
        );

        // episodes
        $this->generateFor(
            Episode::where('release_date', '<', now()->subDays(6)),
            $variant === 'anime'
                ? app_path('Actions/Demo/demo-anime-comments.json')
                : app_path('Actions/Demo/demo-episode-comments.json'),
        );
    }

    protected function generateFor(Builder $builder, string $path): void
    {
        $output = new ConsoleOutput();
        $progressBar = new ProgressBar($output, $builder->count());

        $output->write(
            "Generating comments for {$builder->getModel()->getTable()}",
            true,
        );

        $items = $builder->has('comments', '<', 40)->cursor();

        $userSequence = new Sequence(...$this->users->pluck('id')->toArray());
        $data = json_decode(file_get_contents($path), true);

        $itemComments = collect($data)
            ->slice(0, rand(40, 118))
            ->map(function ($comment) use ($userSequence) {
                $date = now()
                    ->subMonth(rand(0, 2))
                    ->subDays(rand(1, 12));
                return [
                    'user_id' => $userSequence(),
                    'content' => $comment['comment'],
                    'upvotes' => rand(5, 200),
                    'downvotes' => rand(0, 20),
                    'reports_count' => rand(0, 3),
                    'created_at' => $date,
                    'updated_at' => $date,
                ];
            });

        $progressBar->start();
        foreach ($items as $item) {
            $payload = $itemComments->map(function ($comment) use ($item) {
                $data = array_merge($comment, [
                    'id' => $this->currentId,
                    'path' => $this->encodePath($this->currentId),
                    'commentable_id' => $item->id,
                    'commentable_type' => $item::class,
                ]);
                $this->currentId++;
                return $data;
            });
            DB::table('comments')->insert($payload->toArray());
            $progressBar->advance();
        }

        $progressBar->finish();
        $output->write('Finished', true);
    }
}
