import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {useImageSrc} from '@app/images/use-image-src';
import defaultImage from '@app/titles/title-poster/default-title-poster.jpg';

interface Props {
  item: NormalizedModel;
}
export function ChannelContentItemImage({item}: Props) {
  const src = useImageSrc(item.image || defaultImage, {size: 'sm'});
  return (
    <img className="aspect-square w-46 rounded object-cover" src={src} alt="" />
  );
}
