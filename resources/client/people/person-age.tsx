import {Person} from '@app/titles/models/person';
import {FormattedDateTimeRange} from '@common/i18n/formatted-date-time-range';
import {Fragment, memo} from 'react';

interface Props {
  person: Person;
}
export const PersonAge = memo(({person}: Props) => {
  if (person.birth_date && person.death_date) {
    return (
      <FormattedDateTimeRange
        start={person.birth_date}
        end={person.death_date}
        options={{year: 'numeric'}}
      />
    );
  }

  if (person.birth_date) {
    return <Fragment>{calculateAgeFromBirthDate(person.birth_date)}</Fragment>;
  }

  return null;
});

function calculateAgeFromBirthDate(date: string): number {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
