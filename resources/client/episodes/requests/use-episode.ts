import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Title} from '@app/titles/models/title';
import {Episode} from '@app/titles/models/episode';
import {seasonQueryKey} from '@app/seasons/requests/use-season';
import {GroupTitleCredits} from '@app/titles/requests/use-title';

export interface GetEpisodeResponse extends BackendResponse {
  episode: Episode;
  title: Title;
  credits: GroupTitleCredits;
}

interface Params {
  load?: ('videos' | 'credits' | 'compactCredits' | 'primaryVideo')[];
  skipUpdating?: boolean;
}

export function useEpisode(params: Params = {}) {
  const {titleId, season, episode} = useParams();
  return useQuery(
    [...seasonQueryKey(titleId!, season!), 'episodes', `${episode}`, params],
    () => fetchEpisode(titleId!, season!, episode!, params)
  );
}

function fetchEpisode(
  titleId: string,
  seasonNumber: string,
  episodeNumber: string,
  params: Params = {}
) {
  return apiClient
    .get<GetEpisodeResponse>(
      `titles/${titleId}/seasons/${seasonNumber}/episodes/${episodeNumber}`,
      {params}
    )
    .then(response => response.data);
}
