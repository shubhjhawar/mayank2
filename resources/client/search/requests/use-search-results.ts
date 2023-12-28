import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Title} from '@app/titles/models/title';
import {Person} from '@app/titles/models/person';

export interface SearchResponse extends BackendResponse {
  query: string;
  results: (Title | Person)[];
}

interface SearchParams {
  query?: string;
  limit?: number;
}

export function useSearchResults(params: SearchParams) {
  return useQuery(['search', params], () => search(params), {
    enabled: !!params.query,
    keepPreviousData: !!params.query,
  });
}

function search(params: SearchParams) {
  return apiClient
    .get<SearchResponse>(`search/${params.query}`, {params})
    .then(response => response.data);
}
