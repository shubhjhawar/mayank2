import {useSettings} from '@common/core/settings/use-settings';

export type ImageSize = 'sm' | 'md' | 'lg' | 'original';

interface Options {
  size?: ImageSize;
}

export function useImageSrc(src: string, {size}: Options = {}): string {
  const {base_url} = useSettings();
  if (!size) size = 'original';

  if (src.includes('image.tmdb')) {
    return getTmdbSrc(src, size);
  } else if (!src.startsWith('http')) {
    return `${base_url}/${getLocalSrc(src, size)}`;
  }
  return src;
}

function getTmdbSrc(initialSrc: string, size: ImageSize): string {
  switch (size) {
    case 'sm':
      return initialSrc.replace(/original|w1280/, 'w92');
    case 'md':
      return initialSrc.replace(/original|w1280/, 'w300');
    case 'lg':
      return initialSrc.replace(/original|w1280/, 'w500');
    default:
      return initialSrc;
  }
}

function getLocalSrc(initialSrc: string, size: ImageSize): string {
  switch (size) {
    case 'sm':
      return initialSrc.replace('original', 'small');
    case 'md':
      return initialSrc.replace('original', 'medium');
    case 'lg':
      return initialSrc.replace('original', 'large');
    default:
      return initialSrc;
  }
}
