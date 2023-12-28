@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */
?>

@section('body')
    @include('prerender.menu')

    <h1>{{ $meta->getTitle() }}</h1>

    <p>{{ $meta->getDescription() }}</p>

    <h2>{{ __('Search results') }}</h2>
    <ul class="movies">
        @foreach ($meta->getData('results') as $item)
            <li>
                @if ($item['model_type'] === 'title')
                    <figure>
                        <img src="{{ $item['poster'] }}" />
                        <figcaption>
                            <a href="{{ $meta->urls->title($item) }}">
                                {{ $item['name'] }}
                            </a>
                        </figcaption>
                    </figure>
                @else
                    <figure>
                        <img src="{{ $item['poster'] }}" />
                        <figcaption>
                            <a href="{{ $meta->urls->person($item) }}">
                                {{ $item['name'] }}
                            </a>
                        </figcaption>
                    </figure>
                @endif
            </li>
        @endforeach
    </ul>
@endsection
