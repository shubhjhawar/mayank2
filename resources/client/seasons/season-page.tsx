import React, {Fragment} from 'react';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';
import {GetSeasonResponse, useSeason} from '@app/seasons/requests/use-season';
import {TitlePageHeaderImage} from '@app/titles/pages/title-page/title-page-header-image';
import {Title} from '@app/titles/models/title';
import {TitlePoster} from '@app/titles/title-poster/title-poster';
import {Trans} from '@common/i18n/trans';
import {TitleLink} from '@app/titles/title-link';
import {SeasonLink} from '@app/seasons/season-link';
import {useParams} from 'react-router-dom';
import clsx from 'clsx';
import {SitePageLayout} from '@app/site-page-layout';
import {EpisodeListItem} from '@app/seasons/episode-list-item';
import {useSeasonEpisodes} from '@app/titles/requests/use-season-episodes';
import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';

export function SeasonPage() {
  const query = useSeason({load: 'episodes,primaryVideo'});
  const content = query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent data={query.data} />
    </Fragment>
  ) : (
    <PageStatus query={query} loaderClassName="absolute inset-0 m-auto" />
  );

  return <SitePageLayout>{content}</SitePageLayout>;
}

interface PageContentProps {
  data: GetSeasonResponse;
}
function PageContent({data}: PageContentProps) {
  const {title, season} = data;
  return (
    <div>
      <TitlePageHeaderImage title={title} season={season} />
      <div className="container mx-auto mt-40">
        <div className="flex items-center gap-12 mb-24">
          <TitlePoster size="w-70" srcSize="sm" title={title} />
          <div>
            <TitleLink title={title} color="primary" className="text-xl" />
            <div className="text-lg">
              <Trans message="Episode list" />
            </div>
          </div>
        </div>
        <SeasonList title={title} />
        <EpisodeList data={data} />
        <SeasonList title={title} />
      </div>
    </div>
  );
}

interface SeasonListProps {
  title: Title;
}
function SeasonList({title}: SeasonListProps) {
  const {season} = useParams();
  return (
    <div>
      <div className="font-semibold text-base mb-4">
        <Trans message="Seasons" />:
      </div>
      <div className="flex items-center gap-10 mb-34">
        {[...new Array(title.seasons_count).keys()].map(index => {
          const number = index + 1;
          const isActive = season === `${number}`;
          return (
            <SeasonLink
              key={number}
              title={title}
              seasonNumber={number}
              className={clsx(
                'flex items-center justify-center text-base border rounded w-30 h-30',
                isActive
                  ? 'bg-primary text-white pointer-events-none'
                  : 'text-primary'
              )}
            >
              {number}
            </SeasonLink>
          );
        })}
      </div>
    </div>
  );
}

interface EpisodeListProps {
  data: GetSeasonResponse;
}
function EpisodeList({data: {episodes, title}}: EpisodeListProps) {
  const query = useSeasonEpisodes(episodes);
  return (
    <main>
      {query.items.map(episode => (
        <EpisodeListItem
          key={episode.id}
          episode={episode}
          title={title}
          allowRating
          showPlayButton
          className="mb-34"
        />
      ))}
      <InfiniteScrollSentinel query={query} />
    </main>
  );
}
