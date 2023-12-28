import {Video} from '@app/titles/models/video';
import {PlayCircleIcon} from '@common/icons/material/PlayCircle';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import clsx from 'clsx';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {VideoThumbnail} from '@app/videos/video-thumbnail';
import {Title} from '@app/titles/models/title';
import {Episode} from '@app/titles/models/episode';

interface Props {
  videos?: Video[];
  heading?: ReactNode;
  count?: number;
  title?: Title;
  episode?: Episode;
}
export function VideoGrid({videos, heading, count, title, episode}: Props) {
  const isMobile = useIsMobileMediaQuery();
  if (!videos?.length) return null;

  if (!count) {
    count = isMobile ? 4 : 3;
  }

  return (
    <div className="mt-48">
      {heading}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
        {videos.slice(0, count).map(video => (
          <VideoGridItem
            key={video.id}
            video={video}
            title={title}
            episode={episode}
          />
        ))}
      </div>
    </div>
  );
}

interface VideoGridItemProps {
  video: Video;
  className?: string;
  imageSize?: string;
  title?: Title;
  episode?: Episode;
  name?: ReactNode;
  showCategory?: boolean;
  forceTitleBackdrop?: boolean;
}
export function VideoGridItem({
  video,
  className,
  imageSize,
  title,
  episode,
  name,
  showCategory = true,
  forceTitleBackdrop = false,
}: VideoGridItemProps) {
  const link = getWatchLink(video);
  return (
    <div key={video.id} className={className}>
      <Link to={link} className="block relative isolate">
        <VideoThumbnail
          video={video}
          title={title}
          episode={episode}
          size={imageSize}
          forceTitleBackdrop={forceTitleBackdrop}
        />
        <VideoGridItemBottomGradient />
        <span className="absolute bottom-0 left-0 flex items-center gap-x-6 text-white p-10 z-30">
          <PlayCircleIcon size={showCategory ? 'md' : 'lg'} />
          {showCategory && <span className="capitalize">{video.category}</span>}
        </span>
      </Link>
      <Link to={link} className="block mt-12 hover:underline">
        {name || video.name}
      </Link>
    </div>
  );
}

interface VideoGridItemSkeletonProps {
  className?: string;
}
export function VideoGridItemSkeleton({className}: VideoGridItemSkeletonProps) {
  return (
    <div className={clsx(className, 'h-[228px]')}>
      <Skeleton variant="rect" size="w-full aspect-video" animation="pulsate" />
      <Skeleton variant="text" size="w-3/4 mt-12 h-20" />
    </div>
  );
}

export function VideoGridItemBottomGradient() {
  return (
    <div className="player-bottom-gradient absolute w-full h-full pt-36 bottom-0 bg-bottom bg-repeat-x pointer-events-none z-20" />
  );
}
