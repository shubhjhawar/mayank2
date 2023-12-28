import defaultImage from './default-title-poster.jpg';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import clsx from 'clsx';
import {Title} from '@app/titles/models/title';
import {TitleLink} from '@app/titles/title-link';
import {ImageSize, useImageSrc} from '@app/images/use-image-src';
import {Link} from 'react-router-dom';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import {IconButton} from '@common/ui/buttons/icon-button';
import {Fragment} from 'react';

interface Props {
  title: Title;
  className?: string;
  size?: string;
  lazy?: boolean;
  srcSize?: ImageSize;
  aspect?: string;
  showPlayButton?: boolean;
  link?: string;
}
export function TitlePoster({
  title,
  className,
  size = 'w-full',
  srcSize,
  lazy = true,
  aspect = 'aspect-poster',
  showPlayButton,
  link,
}: Props) {
  const {trans} = useTrans();
  const src = useImageSrc(getTitlePoster(title), {size: srcSize});
  if (!title.primary_video) {
    showPlayButton = false;
  }

  const linkChildren = (
    <Fragment>
      <img
        className="block w-full h-full object-cover bg-fg-base/4 rounded"
        draggable={false}
        loading={lazy ? 'lazy' : 'eager'}
        src={src}
        alt={trans(message('Poster for :name', {values: {name: title.name}}))}
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
    </Fragment>
  );

  return (
    <div
      className={clsx(size, aspect, className, 'relative flex-shrink-0 group')}
    >
      {link ? (
        <Link to={link} className="contents">
          {linkChildren}
        </Link>
      ) : (
        <TitleLink title={title} displayContents>
          {linkChildren}
        </TitleLink>
      )}
      {showPlayButton ? (
        <div className="absolute left-14 bottom-14">
          <IconButton
            color="white"
            variant="flat"
            className="shadow-md"
            elementType={Link}
            to={getWatchLink(title.primary_video)}
          >
            <MediaPlayIcon />
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}

export function getTitlePoster(title: Title): string {
  return title?.poster || defaultImage;
}
