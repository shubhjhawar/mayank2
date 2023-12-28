import defaultImage from './default-title-poster.jpg';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import clsx from 'clsx';
import {Title} from '@app/titles/models/title';
import {ImageSize, useImageSrc} from '@app/images/use-image-src';
import {Episode} from '@app/titles/models/episode';
import {TitleLink} from '@app/titles/title-link';
import {EpisodeLink} from '@app/episodes/episode-link';
import {IconButton} from '@common/ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {MediaPlayIcon} from '@common/icons/media/media-play';

// can provide either url for backdrop directly or
// title/episode object if main backdrop for it should be used
interface Props {
  src?: string;
  title?: Title;
  episode?: Episode;
  className?: string;
  size?: string;
  lazy?: boolean;
  srcSize?: ImageSize;
  wrapWithLink?: boolean;
  showPlayButton?: boolean;
}
export function TitleBackdrop({
  src: initialSrc,
  title,
  episode,
  className,
  size,
  srcSize,
  lazy = true,
  wrapWithLink = false,
  showPlayButton,
}: Props) {
  const {trans} = useTrans();
  const primaryVideo = episode?.primary_video || title?.primary_video;
  if (!primaryVideo) {
    showPlayButton = false;
  }

  if (!initialSrc && episode) {
    initialSrc = getEpisodeBackdrop(episode);
  } else if (!initialSrc && title) {
    initialSrc = getTitleBackdrop(title);
  }

  const src = useImageSrc(initialSrc || defaultImage, {size: srcSize});
  const item = episode || title;

  let img = (
    <img
      className={clsx(
        className,
        size,
        'object-cover bg-fg-base/4 aspect-video'
      )}
      draggable={false}
      loading={lazy ? 'lazy' : 'eager'}
      src={src}
      alt={
        item
          ? trans(
              message('Backdrop for :name', {
                values: {name: item.name},
              })
            )
          : ''
      }
    />
  );

  const playButton = showPlayButton ? (
    <div className="absolute left-14 bottom-14">
      <IconButton
        color="white"
        variant="flat"
        className="shadow-md"
        elementType={Link}
        to={getWatchLink(primaryVideo!)}
      >
        <MediaPlayIcon />
      </IconButton>
    </div>
  ) : null;

  if (wrapWithLink) {
    if (episode) {
      img = (
        <EpisodeLink
          episode={episode}
          title={title!}
          seasonNumber={episode.season_number}
          displayContents
        >
          {img}
        </EpisodeLink>
      );
    } else if (title) {
      img = (
        <TitleLink title={title} displayContents>
          {img}
        </TitleLink>
      );
    }
  }

  return (
    <div className="flex-shrink-0 relative group">
      {img}
      {playButton}
      {wrapWithLink && (
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
      )}
    </div>
  );
}

export function getTitleBackdrop(title: Title): string {
  return title?.backdrop || defaultImage;
}

export function getEpisodeBackdrop(episode: Episode): string {
  return episode?.poster || defaultImage;
}
