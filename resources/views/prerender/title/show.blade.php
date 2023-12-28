@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */
?>

@section('body')
    @include('prerender.menu')

    <h1>{{ $meta->getTitle() }}</h1>

    @if ($ogImage = $meta->get('og:image'))
        <img src="{{ url($ogImage) }}" alt="Title poster" width="270px" />
    @endif

    @if ($seasonCount = $meta->getData('title.seasons_count'))
        <div>
            <h3>{{ __('Seasons') }}</h3>
            <ul>
                @foreach (range(0, $seasonCount) as $number)
                    <li>
                        <a
                            href="{{ $meta->urls->season(['title_id' => $meta->getData('title.id'), 'number' => $number], $meta->getData('title')) }}"
                        >
                            Season: {{ $number + 1 }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($genres = $meta->getData('title.genres'))
        <div>
            <h3>{{ __('Genres') }}</h3>
            <ul>
                @foreach ($genres as $genre)
                    <li>
                        <a href="{{ $meta->urls->genre($genre) }}">
                            {{ $genre['display_name'] }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    <dl>
        <dt>{{ __('User Rating') }}</dt>
        <dd>{{ $meta->getData('title.rating') }}</dd>

        <dt>{{ __('Running Time') }}</dt>
        <dd>{{ $meta->getData('title.runtime') }}</dd>

        @if ($cert = $meta->getData('title.certification'))
            <dt>{{ __('Certification') }}</dt>
            <dd>{{ $cert }}</dd>
        @endif

        @if ($tagline = $meta->getData('title.tagline'))
            <dt>{{ __('Tagline') }}</dt>
            <dd>{{ $tagline }}</dd>
        @endif

        @if ($originalTitle = $meta->getData('title.original_title'))
            <dt>{{ __('Original Title') }}</dt>
            <dd>{{ $originalTitle }}</dd>
        @endif

        <dt>{{ __('Release Date') }}</dt>
        <dd>{{ $meta->getData('title.release_date') }}</dd>

        @if (! $meta->getData('title.is_series'))
            <dt>{{ __('Budget') }}</dt>
            <dd>{{ $meta->getData('title.budget') }}</dd>

            <dt>{{ __('Revenue') }}</dt>
            <dd>{{ $meta->getData('title.revenue') }}</dd>
        @endif
    </dl>

    <p>{{ $meta->getDescription() }}</p>

    @if ($credits = $meta->getData('credits'))
        <div>
            <h3>{{ __('Credits') }}</h3>
            <ul style="display: flex; flex-wrap: wrap">
                @foreach ($credits->flatten(1) as $credit)
                    <li>
                        <div>
                            @if ($credit['poster'])
                                <img
                                    src="{{ $credit['poster'] }}"
                                    alt="Credit poster"
                                    width="270px"
                                />
                            @endif

                            <div>
                                <dl>
                                    <dt>{{ __('Job') }}</dt>
                                    <dd>{{ $credit['pivot']['job'] }}</dd>
                                    <dt>{{ __('Department') }}</dt>
                                    <dd>
                                        {{ $credit['pivot']['department'] }}
                                    </dd>
                                    @if ($credit['pivot']['character'])
                                        <dt>{{ __('Character') }}</dt>
                                        <dd>
                                            {{ $credit['pivot']['character'] }}
                                        </dd>
                                    @endif
                                </dl>
                                <a href="{{ $meta->urls->person($credit) }}">
                                    {{ $credit['name'] }}
                                </a>
                            </div>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($videos = $meta->getData('title.videos'))
        <div>
            <h3>{{ __('Videos') }}</h3>
            <ul style="display: flex; flex-wrap: wrap">
                @foreach ($videos as $video)
                    <li>
                        <figure>
                            <img
                                src="{{ $video['thumbnail'] ?: $meta->get('og:image') }}"
                                alt="Video thumbnail"
                                width="180px"
                            />
                            <figcaption>
                                <a href="{{ $meta->urls->watch($video) }}">
                                    {{ $video['name'] }}
                                </a>
                            </figcaption>
                        </figure>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($reviews = $meta->getData('title.reviews'))
        <div>
            <h3>{{ __('Reviews') }}</h3>
            <ul style="display: flex; flex-wrap: wrap">
                @foreach ($reviews as $review)
                    <li>
                        @if(isset($review['user']))
                            <h4>{{ $review['user']['display_name'] }}</h4>
                        @endif
                        <div>{{ $review['score'] }} / 10</div>
                        <p>{{ $review['body'] }}</p>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($images = $meta->getData('title.images'))
        <div>
            <h3>{{ __('Images') }}</h3>
            <ul style="display: flex; flex-wrap: wrap">
                @foreach ($images as $image)
                    <li>
                        <img
                            src="{{ $image['url'] }}"
                            alt="Media image"
                            width="270px"
                        />
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection
