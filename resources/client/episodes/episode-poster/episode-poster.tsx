import defaultImage from './default_episode_poster.jpg';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import clsx from 'clsx';
import {ImageSize, useImageSrc} from '@app/images/use-image-src';
import {Episode} from '@app/titles/models/episode';
import {EpisodeLink} from '@app/episodes/episode-link';
import {Title} from '@app/titles/models/title';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {IconButton} from '@common/ui/buttons/icon-button';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {MediaPlayIcon} from '@common/icons/media/media-play';

interface Props {
  title: Title;
  episode: Episode;
  seasonNumber?: number;
  className?: string;
  size?: string;
  lazy?: boolean;
  srcSize?: ImageSize;
  children?: ReactNode;
  aspect?: string;
  link?: string;
  wrapWithLink?: boolean;
  showPlayButton?: boolean;
  rightAction?: ReactNode;
}
export function EpisodePoster({
  episode,
  title,
  seasonNumber,
  className,
  size,
  srcSize,
  lazy = true,
  children,
  aspect = 'aspect-video',
  link,
  wrapWithLink = true,
  showPlayButton,
  rightAction,
}: Props) {
  const {trans} = useTrans();
  const src = useImageSrc(getEpisodeImage(episode), {size: srcSize});

  let img = (
    <img
      className="w-full h-full object-cover bg-fg-base/4"
      draggable={false}
      loading={lazy ? 'lazy' : 'eager'}
      src={src}
      alt={trans(message('Poster for :name', {values: {name: episode.name}}))}
    />
  );

  const playButton =
    showPlayButton && episode.primary_video ? (
      <IconButton
        color="white"
        variant="flat"
        className="shadow-md absolute left-12 bottom-12 z-10"
        elementType={Link}
        to={getWatchLink(episode.primary_video)}
      >
        <MediaPlayIcon />
      </IconButton>
    ) : null;

  if (wrapWithLink) {
    img = link ? (
      <Link to={link}>{img}</Link>
    ) : (
      <EpisodeLink
        title={title}
        episode={episode}
        seasonNumber={episode.season_number ?? seasonNumber}
        displayContents
      >
        {img}
      </EpisodeLink>
    );
  }

  return (
    <div
      className={clsx('flex-shrink-0 relative group', size, aspect, className)}
    >
      {img}
      {playButton}
      {children && <div className="absolute left-14 bottom-14">{children}</div>}
      {wrapWithLink && (
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
      )}
      {rightAction && (
        <div className="absolute right-12 bottom-12 z-10 shadow-md">
          {rightAction}
        </div>
      )}
    </div>
  );
}

export function getEpisodeImage(episode: Episode): string {
  return episode?.poster || defaultImage;
}
