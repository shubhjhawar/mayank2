import {memo, ReactNode} from 'react';
import {Trans} from '@common/i18n/trans';
import {BulletSeparatedItems} from '@app/titles/bullet-separated-items';
import {PersonLink} from '@app/people/person-link';
import {GroupTitleCredits} from '@app/titles/requests/use-title';

interface Props {
  credits: GroupTitleCredits;
}
export const CompactCredits = memo(({credits}: Props) => (
  <div className="mt-16 pt-16 border-t flex flex-col gap-14">
    {credits.creators?.length ? (
      <PeopleDetail label={<Trans message="Created by" />}>
        <BulletSeparatedItems>
          {credits.creators.slice(0, 3).map(creator => (
            <PersonLink person={creator} key={creator.id} color="primary" />
          ))}
        </BulletSeparatedItems>
      </PeopleDetail>
    ) : null}
    {credits.directing?.length ? (
      <PeopleDetail
        label={
          <Trans
            message="[one Director|other Directors]"
            values={{count: credits.directing.length}}
          />
        }
      >
        <BulletSeparatedItems>
          {credits.directing.slice(0, 3).map(director => (
            <PersonLink person={director} key={director.id} color="primary" />
          ))}
        </BulletSeparatedItems>
      </PeopleDetail>
    ) : null}
    {credits.writing?.length ? (
      <PeopleDetail
        label={
          <Trans
            message="[one Writer|other Writers]"
            values={{count: credits.writing.length}}
          />
        }
      >
        <BulletSeparatedItems>
          {credits.writing.slice(0, 3).map(writer => (
            <PersonLink person={writer} key={writer.id} color="primary" />
          ))}
        </BulletSeparatedItems>
      </PeopleDetail>
    ) : null}
    {credits.actors?.length ? (
      <PeopleDetail label={<Trans message="Stars" />}>
        <BulletSeparatedItems>
          {credits.actors.slice(0, 3).map(actor => (
            <PersonLink person={actor} key={actor.id} color="primary" />
          ))}
        </BulletSeparatedItems>
      </PeopleDetail>
    ) : null}
  </div>
));

interface PeopleDetailProps {
  label: ReactNode;
  children: ReactNode;
}
function PeopleDetail({label, children}: PeopleDetailProps) {
  return (
    <div className="md:flex gap-24 flex-shrink-0">
      <div className="font-bold min-w-84">{label}</div>
      <div>{children}</div>
    </div>
  );
}
