import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Title} from '@app/titles/models/title';
import {BackendResponse} from '@common/http/backend-response/backend-response';

interface Response extends BackendResponse {
  titles: Title[];
}

export function useRelatedTitles(titleId: number) {
  return useQuery(['titles', titleId, 'related'], () =>
    fetchRelatedTitles(titleId!)
  );
}

function fetchRelatedTitles(titleId: number | string) {
  return apiClient
    .get<Response>(`titles/${titleId}/related`)
    .then(response => response.data);
}
