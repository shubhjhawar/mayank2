import {useTitle} from '@app/titles/requests/use-title';

export function useTitlePageData() {
  return useTitle({
    load: [
      'images',
      'genres',
      'productionCountries',
      'keywords',
      'videos',
      'primaryVideo',
      'seasons',
      'compactCredits',
    ],
  });
}
