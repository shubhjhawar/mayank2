import defaultImage from './default-person-poster.jpg';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import clsx from 'clsx';
import {Person} from '@app/titles/models/person';
import {PersonLink} from '@app/people/person-link';
import {ImageSize, useImageSrc} from '@app/images/use-image-src';

interface Props {
  person: Person;
  className?: string;
  size?: string;
  lazy?: boolean;
  srcSize?: ImageSize;
  rounded?: boolean;
}
export function PersonPoster({
  person,
  className,
  size,
  srcSize,
  lazy = true,
  rounded = false,
}: Props) {
  const {trans} = useTrans();
  const src = useImageSrc(getPersonImage(person), {size: srcSize});
  return (
    <PersonLink person={person} className="flex-shrink-0">
      <img
        className={clsx(
          className,
          size,
          'object-cover bg-fg-base/4',
          rounded ? 'rounded-full aspect-square' : 'rounded aspect-poster'
        )}
        draggable={false}
        loading={lazy ? 'lazy' : 'eager'}
        src={src}
        alt={trans(
          message('Cover image for :name', {values: {name: person.name}})
        )}
      />
    </PersonLink>
  );
}

export function getPersonImage(person: Person): string {
  return person?.poster || defaultImage;
}
