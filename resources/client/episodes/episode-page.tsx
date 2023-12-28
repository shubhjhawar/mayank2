import {PageStatus} from '@common/http/page-status';
import {Title} from '@app/titles/models/title';
import {PageMetaTags} from '@common/http/page-meta-tags';
import React, {Fragment} from 'react';
import {TitlePageHeaderImage} from '@app/titles/pages/title-page/title-page-header-image';
import {
  GetEpisodeResponse,
  useEpisode,
} from '@app/episodes/requests/use-episode';
import {ChipList} from '@common/ui/forms/input-field/chip-field/chip-list';
import {Chip} from '@common/ui/forms/input-field/chip-field/chip';
import {Link} from 'react-router-dom';
import {TitlePageCast} from '@app/titles/pages/title-page/sections/title-page-cast';
import {RelatedTitlesPanel} from '@app/titles/related-titles-panel';
import {CompactCredits} from '@app/titles/compact-credits';
import {TitlePageAsideLayout} from '@app/titles/pages/title-page/title-page-aside-layout';
import {WatchlistButton} from '@app/user-lists/watchlist-button';
import {TitlePoster} from '@app/titles/title-poster/title-poster';
import {getGenreLink} from '@app/titles/genre-link';
import {SitePageLayout} from '@app/site-page-layout';
import {EpisodePageHeader} from '@app/episodes/episode-page-header';
import {TruncatedDescription} from '@common/ui/truncated-description';
import {TitlePageVideoGrid} from '@app/titles/pages/title-page/sections/title-page-video-grid';
import {useIsStreamingMode} from '@app/videos/use-is-streaming-mode';
import {WatchNowButton} from '@app/titles/pages/title-page/watch-now-button';
import {Episode} from '@app/titles/models/episode';
import {TitlePageSections} from '@app/titles/pages/title-page/sections/title-page-sections';
import {useConfiguredTitlePageSections} from '@app/titles/pages/title-page/sections/use-configured-title-page-sections';

export function EpisodePage() {
  const query = useEpisode({
    load: ['videos', 'compactCredits', 'primaryVideo'],
  });

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
  data: GetEpisodeResponse;
}
function PageContent({data}: PageContentProps) {
  const {episode, title} = data;
  return (
    <div>
      <TitlePageHeaderImage title={title} episode={episode} />
      <div className="container mx-auto mt-40 px-24">
        <div className="flex items-start gap-54">
          <Aside title={title} episode={episode} />
          <div className="flex-auto">
            <EpisodePageHeader title={title} episode={episode} />
            <MainContent data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MainContentProps {
  data: GetEpisodeResponse;
}
function MainContent({data}: MainContentProps) {
  const {episode, title, credits} = data;
  const sections = useConfiguredTitlePageSections();
  return (
    <main className="@container">
      {title.genres?.length ? (
        <ChipList>
          {title.genres.map(genre => (
            <Chip
              className="capitalize"
              elementType={Link}
              to={getGenreLink(genre)}
              key={genre.id}
            >
              {genre.display_name || genre.name}
            </Chip>
          ))}
        </ChipList>
      ) : null}
      <TruncatedDescription
        className="mt-16"
        description={episode.description}
      />
      <CompactCredits credits={credits} />
      {sections.map(name => (
        <EpisodePageSection key={name} name={name} title={title} data={data} />
      ))}
    </main>
  );
}

interface EpisodePageSectionProps {
  title: Title;
  data: GetEpisodeResponse;
  name: (typeof TitlePageSections)[number];
}
function EpisodePageSection({name, title, data}: EpisodePageSectionProps) {
  switch (name) {
    case 'videos':
      return <TitlePageVideoGrid title={title} episode={data.episode} />;
    case 'cast':
      return <TitlePageCast credits={data.credits.actors} />;
    case 'related':
      return <RelatedTitlesPanel title={title} />;
    default:
      return null;
  }
}

interface AsideProps {
  title: Title;
  episode: Episode;
}
function Aside({title, episode}: AsideProps) {
  const isStreamingMode = useIsStreamingMode();
  return (
    <TitlePageAsideLayout
      poster={<TitlePoster title={title} size="w-full" srcSize="lg" />}
    >
      {isStreamingMode && episode.primary_video && (
        <WatchNowButton
          video={episode.primary_video}
          variant="flat"
          defaultLabel
        />
      )}
      <WatchlistButton
        item={title}
        variant={isStreamingMode ? 'outline' : 'flat'}
      />
    </TitlePageAsideLayout>
  );
}
