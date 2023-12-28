import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {NewsArticle} from '@app/titles/models/news-article';

interface Response extends BackendResponse {
  news_articles: NewsArticle[];
}

export function useTitleNews(titleId: number | string) {
  return useQuery(['titles', `${titleId}`, 'news'], () => fetchNews(titleId));
}

function fetchNews(titleId: number | string) {
  return apiClient
    .get<Response>(`titles/${titleId}/news`)
    .then(response => response.data);
}
