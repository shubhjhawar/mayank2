import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {NewsArticle} from '@app/titles/models/news-article';

interface Response extends PaginatedBackendResponse<NewsArticle> {}

interface Params {
  perPage?: number;
}

export function useNewsArticles(params?: Params) {
  return useQuery(['news', params], () => fetchNewsArticles(params));
}

function fetchNewsArticles(params?: Params) {
  return apiClient
    .get<Response>(`news`, {params})
    .then(response => response.data);
}
