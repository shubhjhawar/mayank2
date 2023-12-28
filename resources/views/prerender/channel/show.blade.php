@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */
?>

@section('body')
    @include('prerender.menu')

    <h1>{{ $meta->getData('channel.name') }}</h1>

    <ul style="display: flex; flex-wrap: wrap">
        @foreach ($meta->getData('channel.content.data') as $item)
            <li>
                @if ($item['model_type'] === 'channel')
                    @foreach ($item['content']['data'] as $subItem)
                        @include('prerender.channel.channel-content', ['item' => $subItem])
                    @endforeach
                @else
                    @include('prerender.channel.channel-content', ['item' => $item])
                @endif
            </li>
        @endforeach
    </ul>
@endsection
