@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */ ?>

@section('body')
    @include('prerender.menu')

    <h1>{{$meta->getData('article.title')}}</h1>

    <h2>{{$meta->getData('article.byline')}}</h2>
    <h3>{{$meta->getData('article.source')}}</h3>

    @if($image = $meta->getData('article.image'))
        <img src="{{$image}}" alt="Article image">
    @endif

    <article>
        {!!$meta->getData('article.body')!!}
    </article>
@endsection
