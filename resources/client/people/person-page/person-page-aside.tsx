import {
  DetailItem,
  TitlePageAsideLayout,
} from '@app/titles/pages/title-page/title-page-aside-layout';
import {PersonPoster} from '@app/people/person-poster/person-poster';
import {Trans} from '@common/i18n/trans';
import {FormattedDate} from '@common/i18n/formatted-date';
import React from 'react';
import {PersonAge} from '@app/people/person-age';
import {GetPersonResponse} from '@app/people/requests/use-person';

interface Props {
  data: GetPersonResponse;
}
export function PersonPageAside({data: {person, total_credits_count}}: Props) {
  return (
    <TitlePageAsideLayout
      poster={
        <PersonPoster person={person} size="w-140 md:w-full" srcSize="lg" />
      }
    >
      <dl className="md:mt-24">
        {person.known_for && (
          <DetailItem label={<Trans message="Known for" />}>
            {person.known_for}
          </DetailItem>
        )}
        {person.gender && (
          <DetailItem label={<Trans message="Gender" />}>
            <span className="capitalize">{person.gender}</span>
          </DetailItem>
        )}
        {total_credits_count ? (
          <DetailItem label={<Trans message="Known credits" />}>
            {total_credits_count}
          </DetailItem>
        ) : null}
        {person.birth_date ? (
          <DetailItem label={<Trans message="Birthdate" />}>
            <FormattedDate date={person.birth_date} /> (
            <Trans
              message=":count years old"
              values={{count: <PersonAge person={person} />}}
            />
            )
          </DetailItem>
        ) : null}
        {person.birth_place ? (
          <DetailItem label={<Trans message="Birthplace" />}>
            {person.birth_place}
          </DetailItem>
        ) : null}
        {person.death_date ? (
          <DetailItem label={<Trans message="Date of death" />}>
            <FormattedDate date={person.death_date} />
          </DetailItem>
        ) : null}
      </dl>
    </TitlePageAsideLayout>
  );
}
