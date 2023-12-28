import {useTrans} from '@common/i18n/use-trans';
import {ChipValue} from '@common/ui/forms/input-field/chip-field/chip-field';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useSettings} from '@common/core/settings/use-settings';
import {message} from '@common/i18n/message';
import {toast} from '@common/ui/toast/toast';

export interface ImportMultipleFromTmdbFormValue {
  type: 'movie' | 'series';
  country?: string;
  language?: string;
  min_rating?: string;
  max_rating?: string;
  genres?: ChipValue[];
  keywords?: ChipValue[];
  release_date?: {
    start?: string;
    end?: string;
  };
  pages_to_import?: number;
  start_from_page?: number;
}

interface Payload
  extends Omit<
    ImportMultipleFromTmdbFormValue,
    'genres' | 'keywords' | 'release_date'
  > {
  genres?: string;
  keywords?: string;
  start_date?: string;
  end_date?: string;
}

export interface ImportMultipleProgressData {
  totalItems: number;
  currentItem: number;
  currentPage: number;
  currentIndex: number;
  totalPages: number;
  title: string;
  progress: number;
  titleList: string[];
}

interface MutateOptions {
  onSuccess?: () => void;
  onProgress?: (data: ImportMultipleProgressData) => void;
}

export function useImportMultipleFromTmdb() {
  const {trans} = useTrans();
  const {base_url} = useSettings();
  const source = useRef<EventSource>();
  const [isLoading, setIsLoading] = useState(false);

  const titlesList = useRef<string[]>([]);

  const cancel = useCallback(() => {
    source.current?.close();
    titlesList.current = [];
    setIsLoading(false);
  }, []);

  const mutate = useCallback(
    (values: ImportMultipleFromTmdbFormValue, options: MutateOptions) => {
      setIsLoading(true);
      const params = formValueToQueryString(values);

      source.current = new EventSource(
        `${base_url}/api/v1/tmdb/import?${params}`
      );

      source.current.onmessage = event => {
        const data = JSON.parse(event.data);
        // limit array to 1000 items
        if (titlesList.current.length > 1000) {
          titlesList.current = titlesList.current.slice(0, 1000);
        }
        titlesList.current.unshift(data.title);
        options.onProgress?.({
          ...data,
          titleList: titlesList.current,
        });
      };

      source.current.onerror = () => {
        cancel();
        options.onSuccess?.();
        toast(trans(message('Titles imported')));
      };
    },
    [base_url, trans, cancel]
  );

  useEffect(() => () => source.current?.close(), []);

  return {
    isLoading,
    mutate,
    cancel,
  };
}

function formValueToQueryString(
  values: ImportMultipleFromTmdbFormValue
): string {
  const payload: Payload = {
    type: values.type,
    pages_to_import: values.pages_to_import,
    start_from_page: values.start_from_page,
  };

  if (values.country) {
    payload.country = values.country;
  }

  if (values.language) {
    payload.language = values.language;
  }

  if (values.min_rating) {
    payload.min_rating = values.min_rating;
  }

  if (values.max_rating) {
    payload.max_rating = values.max_rating;
  }

  if (values.genres) {
    payload.genres = values.genres.map(genre => genre.id).join(',');
  }
  if (values.keywords) {
    payload.keywords = values.keywords.map(keyword => keyword.id).join(',');
  }
  if (values.release_date) {
    payload.start_date = values.release_date.start;
    payload.end_date = values.release_date.start;
  }

  return new URLSearchParams(payload as any).toString();
}
