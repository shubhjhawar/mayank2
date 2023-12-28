import {ChannelContentProps} from '@app/channels/channel-content';
import React, {Fragment} from 'react';
import {useCarousel} from '@app/channels/carousel/use-carousel';
import {Title} from '@app/titles/models/title';
import {TitleRating} from '@app/reviews/title-rating';
import {Button} from '@common/ui/buttons/button';
import {Trans} from '@common/i18n/trans';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import {TitleLink} from '@app/titles/title-link';
import {TitleBackdrop} from '@app/titles/title-poster/title-backdrop';
import {TitlePoster} from '@app/titles/title-poster/title-poster';
import {IconButton} from '@common/ui/buttons/icon-button';
import {ChevronLeftIcon} from '@common/icons/material/ChevronLeft';
import {ChevronRightIcon} from '@common/icons/material/ChevronRight';
import {ChannelHeader} from '@app/channels/channel-header/channel-header';
import {AnimatePresence, m} from 'framer-motion';
import {Link} from 'react-router-dom';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {useChannelContent} from '@common/channels/requests/use-channel-content';
import {Channel, ChannelContentItem} from '@common/channels/channel';

export function ChannelContentSlider({
  channel,
  isNested,
}: ChannelContentProps<Title>) {
  const {
    scrollContainerRef,
    activePage,
    canScrollBackward,
    canScrollForward,
    scrollToNextPage,
    scrollToPreviousPage,
  } = useCarousel({rotate: true});
  const {data} = useChannelContent<ChannelContentItem<Title>>(channel);
  const titles = data || [];

  return (
    <Fragment>
      <ChannelHeader
        channel={channel as Channel}
        isNested={isNested}
        margin="mb-18"
      />
      <div className="flex gap-24">
        <div className="relative flex-auto">
          <div
            ref={scrollContainerRef}
            className="hidden-scrollbar flex h-full select-none snap-x snap-mandatory snap-always items-center overflow-x-auto"
          >
            {titles.map(item => (
              <Slide key={item.id} item={item} />
            ))}
          </div>
          <div className="absolute top-[170px] z-20 w-full">
            <div className="absolute left-14">
              <IconButton
                variant="outline"
                radius="rounded"
                size="lg"
                color="white"
                disabled={!canScrollBackward}
                onClick={() => scrollToPreviousPage()}
              >
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <div className="absolute right-14">
              <IconButton
                variant="outline"
                radius="rounded"
                size="lg"
                color="white"
                disabled={!canScrollForward}
                onClick={() => scrollToNextPage()}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <UpNext titles={titles} activePage={activePage} />
      </div>
    </Fragment>
  );
}

interface SlideProps {
  item: Title;
}
function Slide({item}: SlideProps) {
  return (
    <div className="relative h-full w-full flex-shrink-0 snap-start snap-normal overflow-hidden rounded">
      <TitleBackdrop title={item} size="h-full" />
      <div className="absolute inset-0 isolate flex h-full w-full items-end justify-start gap-24 rounded p-30 text-white">
        <div className="absolute bottom-0 left-0 h-3/4 w-full bg-gradient-to-t from-black/100" />
        <TitlePoster
          title={item}
          size="max-h-320"
          srcSize="md"
          className="z-10 shadow-md"
        />
        <div className="z-10 max-w-620 text-lg">
          <TitleRating score={item.rating} />
          <div className="my-8 text-5xl">
            <TitleLink title={item} />
          </div>
          <p>{item.description.slice(0, 200)}</p>
          {item.primary_video && (
            <Button
              variant="flat"
              color="primary"
              startIcon={<MediaPlayIcon />}
              radius="rounded-full"
              className="mt-24 min-h-42 min-w-144"
              elementType={Link}
              to={getWatchLink(item.primary_video)}
            >
              {item.primary_video.category === 'full' ? (
                <Trans message="Watch now" />
              ) : (
                <Trans message="Play trailer" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface UpNextProps {
  titles: Title[];
  activePage: number;
}
function UpNext({titles, activePage}: UpNextProps) {
  const itemCount = titles.length;
  const start = activePage + 1;
  const end = start + 3;
  const items = titles.slice(start, end);
  if (end > itemCount) {
    items.push(...titles.slice(0, end - itemCount));
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      <div className="w-1/4 max-w-200 flex-shrink-0">
        <div className="mb-12 text-lg font-semibold">
          <Trans message="Up next" />
        </div>
        <div className="flex flex-col gap-24">
          {items.map(item => (
            <m.div
              key={item.id}
              className="relative flex-auto"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
            >
              <TitleBackdrop
                title={item}
                className="mb-6 rounded"
                size="w-full"
                srcSize="md"
                wrapWithLink
                showPlayButton
              />
              <div className="mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
                <TitleLink title={item} className="text-base font-medium" />
              </div>
              <div>
                <TitleRating score={item.rating} className="text-sm" />
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
}
