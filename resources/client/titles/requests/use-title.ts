import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {Title, TitleCredit, TitleCreditPivot} from '@app/titles/models/title';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {LengthAwarePaginationResponse} from '@common/http/backend-response/pagination-response';
import {Season} from '@app/titles/models/season';

export type GroupTitleCredits = Record<
  TitleCreditPivot['department'],
  TitleCredit[]
>;

export interface GetTitleResponse extends BackendResponse {
  title: Title;
  seasons: LengthAwarePaginationResponse<Season>;
  credits: GroupTitleCredits;
}

interface Params {
  skipUpdating?: boolean;
  load?: (
    | 'images'
    | 'genres'
    | 'productionCountries'
    | 'keywords'
    | 'videos'
    | 'primaryVideo'
    | 'seasons'
    | 'credits'
    | 'compactCredits'
  )[];
  loadCount?: 'seasons'[];
}

export function useTitle(params: Params = {}) {
  const {titleId} = useParams();
  return useQuery(['titles', `${titleId}`, params], () =>
    fetchTitle(titleId!, params)
  );
}

function fetchTitle(titleId: number | string, params: Params) {
  return apiClient
    .get<GetTitleResponse>(`titles/${titleId}`, {params})
    .then(response => response.data);
}
