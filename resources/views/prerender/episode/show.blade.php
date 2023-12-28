@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */ ?>

@section('body')
    @include('prerender.menu')

    <h1>{{ $meta->getTitle() }}</h1>

    <img src="{{$meta->getData('episode.poster')}}" alt="Episode poster" width="270px">

    <dl>
        <dt>{{__('User Rating')}}</dt>
        <dd>{{$meta->getData('episode.rating')}}</dd>

        <dt>{{__('Running Time')}}</dt>
        <dd>{{$meta->getData('episode.runtime')}}</dd>

        <dt>{{__('Release Date')}}</dt>
        <dd>{{$meta->getData('episode.release_date')}}</dd>
    </dl>

    <p>{{ $meta->getData('episode.description') }}</p>

    <div>
        <h3>{{__('Credits')}}</h3>
        <ul style="display: flex; flex-wrap: wrap;">
            @foreach($meta->getData('credits')->flatten(1) as $credit)
                <li>
                    <div>
                        @if($credit['poster'])
                            <img src="{{$credit['poster']}}" alt="Credit poster" width="270px">
                        @endif
                        <div>
                            <dl>
                                <dt>{{__('Job')}}</dt>
                                <dd>{{$credit['pivot']['job']}}</dd>
                                <dt>{{__('Department')}}</dt>
                                <dd>{{$credit['pivot']['department']}}</dd>
                                @if($credit['pivot']['character'])
                                    <dt>{{__('Character')}}</dt>
                                    <dd>{{$credit['pivot']['character']}}</dd>
                                @endif
                            </dl>
                            <a href="{{$meta->urls->person($credit)}}">{{$credit['name']}}</a>
                        </div>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
@endsection
