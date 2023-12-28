@extends('common::prerender.base')

<?php /** @var Common\Core\Prerender\MetaTags $meta */ ?>

@section('body')
    @include('prerender.menu')

    <h1>{{ __('Popular People') }}</h1>

    <p>{{ $meta->getDescription() }}</p>

    <ul style="display: flex; flex-wrap: wrap;">
        @foreach($meta->getData('pagination') as $person)
            <li>
                <img src="{{$meta->urls->mediaImage($person)}}" alt="Person poster" width="270px">
                <h3>
                    <a href="{{$meta->urls->person($person)}}">{{$person['name']}}</a>
                </h3>
                <div>{{$person['known_for']}}</div>
                @if(isset($person['primary_credit']))
                    <div>
                        <a href="{{$meta->urls->person($person['primary_credit'])}}">{{$person['primary_credit']['name']}}</a>
                    </div>
                @endif
                <p>{{$person['description']}}</p>
            </li>
        @endforeach

        {{ $meta->getData('pagination')->withPath('people')->links() }}
    </ul>
@endsection
