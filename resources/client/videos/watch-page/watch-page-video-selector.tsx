import {UseWatchPageVideoResponse} from '@app/videos/requests/use-watch-page-video';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {Button} from '@common/ui/buttons/button';
import {Link, useParams} from 'react-router-dom';
import {AnimatePresence, m} from 'framer-motion';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import {opacityAnimation} from '@common/ui/animation/opacity-animation';
import clsx from 'clsx';
import {Video} from '@app/titles/models/video';

const className = 'flex items-center flex-wrap gap-14 mt-14';

interface Props {
  data: UseWatchPageVideoResponse | undefined;
}
export function WatchPageVideoSelector({data}: Props) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {data ? <VideoList videos={data.alternative_videos} /> : <Skeletons />}
    </AnimatePresence>
  );
}

interface VideoListProps {
  videos: Video[];
}
function VideoList({videos}: VideoListProps) {
  const {videoId} = useParams();

  if (videos.length < 2) {
    return null;
  }

  return (
    <m.div
      key="alternative-sources"
      className={className}
      {...opacityAnimation}
    >
      {videos.map(video => (
        <Button
          elementType={Link}
          to={getWatchLink(video)}
          key={video.id}
          variant="outline"
          color={videoId === `${video.id}` ? 'primary' : 'chip'}
          startIcon={<MediaPlayIcon aria-hidden />}
          className="min-h-42"
        >
          {video.name}
        </Button>
      ))}
    </m.div>
  );
}

function Skeletons() {
  return (
    <m.div
      key="skeletons"
      className={clsx(className, 'h-42')}
      {...opacityAnimation}
    >
      <Skeleton variant="rect" size="h-full w-[116px]" />
      <Skeleton variant="rect" size="h-full w-[116px]" />
      <Skeleton variant="rect" size="h-full w-[116px]" />
      <Skeleton variant="rect" size="h-full w-[116px]" />
      <Skeleton variant="rect" size="h-full w-[116px]" />
    </m.div>
  );
}
