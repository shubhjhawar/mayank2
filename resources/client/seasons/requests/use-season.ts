import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Season} from '@app/titles/models/season';
import {Title} from '@app/titles/models/title';
import {Episode} from '@app/titles/models/episode';
import {PaginationResponse} from '@common/http/backend-response/pagination-response';

export interface GetSeasonResponse extends BackendResponse {
  season: Season;
  title: Title;
  episodes?: PaginationResponse<Episode>;
}

interface Params {
  skipUpdating?: boolean;
  truncateDescriptions?: boolean;
  load?: string;
}

export const seasonQueryKey = (
  titleId: number | string,
  season: number | string,
  params?: any
) => {
  const key = ['titles', `${titleId}`, 'seasons', `${season}`];
  if (params) {
    key.push(params);
  }
  return key;
};

interface Props {
  titleId?: number | string;
  season?: number | string;
}

export function useSeason(payload: Params = {}, props: Props = {}) {
  const urlParams = useParams();
  const titleId = props.titleId || urlParams.titleId;
  const season = props.season || urlParams.season;
  return useQuery(seasonQueryKey(titleId!, season!, payload), () =>
    fetchSeason(titleId!, season!, payload)
  );
}

function fetchSeason(
  titleId: number | string,
  seasonNumber: number | string,
  params: Params
) {
  return apiClient
    .get<GetSeasonResponse>(`titles/${titleId}/seasons/${seasonNumber}`, {
      params,
    })
    .then(response => response.data);
}
