import {EpisodePoster} from '@app/episodes/episode-poster/episode-poster';
import {CompactSeasonEpisode} from '@app/episodes/compact-season-episode';
import {EpisodeLink} from '@app/episodes/episode-link';
import {InteractableRating} from '@app/reviews/interactable-rating';
import React, {ReactNode} from 'react';
import {Episode} from '@app/titles/models/episode';
import {Title} from '@app/titles/models/title';
import {TitleRating} from '@app/reviews/title-rating';
import clsx from 'clsx';
import {FormattedDate} from '@common/i18n/formatted-date';

interface Props {
  episode: Episode;
  title: Title;
  allowRating?: boolean;
  className?: string;
  children?: ReactNode;
  showPlayButton?: boolean;
  centerPlayButton?: boolean;
}
export function EpisodeListItem({
  episode,
  title,
  allowRating = true,
  className,
  children,
  showPlayButton,
}: Props) {
  return (
    <div className={clsx('flex items-center gap-20', className)}>
      <div className="relative w-288 flex-shrink-0 overflow-hidden rounded max-md:hidden">
        <EpisodePoster
          title={title}
          episode={episode}
          seasonNumber={episode.season_number}
          lazy={true}
          srcSize="md"
          showPlayButton={showPlayButton}
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-black/50 text-white text-center text-sm">
          <CompactSeasonEpisode episode={episode} />
        </div>
      </div>
      <div>
        <EpisodeLink
          title={title}
          seasonNumber={episode.season_number}
          episode={episode}
          color="primary"
          className="text-base font-medium"
        />
        <div className="my-10">
          <EpisodeRating
            title={title}
            episode={episode}
            allowRating={allowRating}
          />
        </div>
        {episode.description && (
          <div className="text-sm">{episode.description}</div>
        )}
        {children}
      </div>
    </div>
  );
}

interface EpisodeRatingProps {
  title: Title;
  episode: Episode;
  allowRating: boolean;
}
function EpisodeRating({title, episode, allowRating}: EpisodeRatingProps) {
  if (episode.status === 'upcoming') {
    return <FormattedDate date={episode.release_date} />;
  }

  return allowRating ? (
    <InteractableRating title={title} episode={episode} />
  ) : (
    <TitleRating score={episode.rating} />
  );
}
