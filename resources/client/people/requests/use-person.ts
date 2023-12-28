import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {useParams} from 'react-router-dom';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Person} from '@app/titles/models/person';
import {PersonCredit} from '@app/titles/models/title';

export interface GetPersonResponse extends BackendResponse {
  person: Person;
  knownFor: PersonCredit[];
  credits: Record<string, PersonCredit[]>;
  total_credits_count: number;
}

interface Params {
  skipUpdating?: boolean;
}

export function usePerson(params: Params = {}) {
  const {personId} = useParams();
  return useQuery(['people', `${personId}`, params], () =>
    fetchPerson(personId!, params)
  );
}

function fetchPerson(personId: number | string, params: Params) {
  return apiClient
    .get<GetPersonResponse>(`people/${personId}`, {params})
    .then(response => response.data);
}
