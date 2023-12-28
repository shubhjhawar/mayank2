import {Title} from '@app/titles/models/title';
import {Episode} from '@app/titles/models/episode';
import {TitleBackdrop} from '@app/titles/title-poster/title-backdrop';
import {useSettings} from '@common/core/settings/use-settings';
import {IconButton} from '@common/ui/buttons/icon-button';
import {MediaPlayIcon} from '@common/icons/media/media-play';
import {Link} from 'react-router-dom';
import {getWatchLink} from '@app/videos/watch-page/get-watch-link';
import {Season} from '@app/titles/models/season';

interface Props {
  title: Title;
  season?: Season;
  episode?: Episode;
}
export function TitlePageHeaderImage({title, season, episode}: Props) {
  const {streaming} = useSettings();
  const watchItem = episode || season || title;
  const backdrop = (
    <TitleBackdrop
      title={title}
      episode={episode}
      size="w-full h-full"
      className="object-top"
      lazy={false}
    />
  );
  return (
    <header className="relative h-160 md:h-450 isolate overflow-hidden bg-black">
      <div className="container w-full h-full mx-auto px-24 absolute top-0 left-0 right-0 z-20">
        {backdrop}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-[calc(100%+100px)] h-[calc(100% + 20px)] blur-md z-10 opacity-50">
        {backdrop}
      </div>
      <div className="bg-gradient-to-b from-black/70 absolute top-0 left-0 w-full h-full z-30 pointer-events-none" />
      {streaming.show_header_play && watchItem.primary_video ? (
        <PlayButton item={watchItem} />
      ) : null}
    </header>
  );
}

interface PlayButtonProps {
  item: Season | Episode | Title;
}
function PlayButton({item}: PlayButtonProps) {
  const link = getWatchLink(item.primary_video!);
  return (
    <IconButton
      radius="rounded-full"
      color="white"
      variant="raised"
      size="lg"
      className="absolute inset-0 m-auto z-40"
      elementType={Link}
      to={link}
    >
      <MediaPlayIcon />
    </IconButton>
  );
}
