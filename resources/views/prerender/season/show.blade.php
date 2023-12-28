@extends('common::prerender.base')

<?php
/** @var Common\Core\Prerender\MetaTags $meta */
?>

@section('body')
    @include('prerender.menu')

    <h1>
        {{ $meta->getData('title.name') }}: {{ __('Season') }}
        {{ $meta->getData('season.number') }}
    </h1>

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

    @if ($episodes = $meta->getData('episodes'))
        <div>
            <ul>
                @foreach ($meta->getData('episodes') as $episode)
                    <li>
                        <figure>
                            <img
                                src="{{ $episode['poster'] }}"
                                alt="Episode poster"
                                width="270px"
                            />
                            <figcaption>
                                <a
                                    href="{{ $meta->urls->episode($episode, $meta->getData('title')) }}"
                                >
                                    {{ $episode['name'] }}
                                </a>
                            </figcaption>
                        </figure>
                        <p>{{ $episode['description'] }}</p>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection
