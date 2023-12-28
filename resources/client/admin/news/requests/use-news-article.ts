import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {NewsArticle} from '@app/titles/models/news-article';
import {useParams} from 'react-router-dom';

interface Response extends BackendResponse {
  article: NewsArticle;
}

export function useNewsArticle() {
  const {articleId} = useParams();
  return useQuery(['news-articles', `${articleId}`], () =>
    fetchNewsArticle(articleId!)
  );
}

function fetchNewsArticle(articleId: string) {
  return apiClient
    .get<Response>(`news/${articleId}`)
    .then(response => response.data);
}
