import React, {useMemo} from 'react';
import {
  BaseMediaLink,
  BaseMediaLinkProps,
  getBaseMediaLink,
} from '@app/base-media-link';
import {Keyword} from '@app/titles/models/keyword';

interface Props extends Omit<BaseMediaLinkProps, 'link'> {
  keyword: Keyword;
}
export function KeywordLink({keyword, children, ...otherProps}: Props) {
  const link = useMemo(() => getKeywordLink(keyword), [keyword]);
  return (
    <BaseMediaLink {...otherProps} link={link}>
      {children ?? (keyword.display_name || keyword.name)}
    </BaseMediaLink>
  );
}

export function getKeywordLink(
  keyword: Keyword,
  {absolute}: {absolute?: boolean} = {}
): string {
  return getBaseMediaLink(`/keyword/${keyword.name}`, {absolute});
}
